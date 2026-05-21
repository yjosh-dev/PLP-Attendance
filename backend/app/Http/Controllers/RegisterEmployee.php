<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

use App\Models\EmployeeAccount;
use App\Models\EmployeeInformation;
use App\Models\EmployeeContact;
use App\Mail\AttendanceNotification;

class RegisterEmployee extends Controller
{
    public function RegisterEmployee(Request $request) {
        $validated = $request->validate([
            // ACCOUNT
            'employee_id'      => 'required|string|unique:employee_account,employee_id',
            'account_email'    => 'required|email|unique:employee_account,account_email',
            'account_password' => 'required|string|min:8',

            // INFORMATION
            'first_name'       => 'required|string|max:255',
            'middle_name'      => 'nullable|string|max:255',
            'last_name'        => 'required|string|max:255',
            'department'       => 'required|',
            'position'         => 'required|',
            'birthdate'        => 'required|date',
            'profile_image'    => 'nullable|image|mimes:jpg,jpeg,png|max:2048',

            // CONTACT
            'email'            => 'required|email|unique:employee_account_contact,email',
            'phone'            => 'required|string|max:15',
            'address'          => 'required|string|max:255',
        ]);

        DB::beginTransaction();

        try {
            $plainPassword = $validated['account_password']; // ← save before hashing
            $validated['account_password'] = bcrypt($validated['account_password']);

            if ($request->hasFile('profile_image')) {
                $validated['profile_image'] = $request->file('profile_image')
                                                      ->store('profiles', 'public');
            }

            $account = EmployeeAccount::create([
                'employee_id'      => $validated['employee_id'],
                'account_email'    => $validated['account_email'],
                'account_password' => $validated['account_password'],
            ]);

            EmployeeInformation::create([
                'employee_id'   => $validated['employee_id'],
                'first_name'    => $validated['first_name'],
                'middle_name'   => $validated['middle_name'] ?? null,
                'last_name'     => $validated['last_name'],
                'department'    => $validated['department'],
                'position'      => $validated['position'],
                'birthdate'     => $validated['birthdate'],
                'profile_image' => $validated['profile_image'] ?? 'default.jpg',
            ]);

            EmployeeContact::create([
                'employee_id'  => $validated['employee_id'],
                'email'        => $validated['email'],
                'phone_number' => $validated['phone'],
                'address'      => $validated['address'],
            ]);

            DB::commit();

            // Send credentials email to account email
            Mail::to($validated['account_email'])->send(
                new AttendanceNotification([
                    'first_name'  => $validated['first_name'],
                    'last_name'   => $validated['last_name'],
                    'email'       => $validated['account_email'],
                    'password'    => $plainPassword,
                    'employee_id' => $validated['employee_id'],
                    'department'  => $validated['department'],
                    'position'    => $validated['position'],
                ])
            );

            return response()->json([
                'success' => true,
                'message' => 'Employee registered successfully',
                'data'    => $account
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Registration failed',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    public function DeleteEmployee(Request $request) {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employee_account,employee_id'
        ]);

        EmployeeAccount::where('employee_id', $validated['employee_id'])->delete();

        return response()->json([
            'success' => true,
            'message' => 'Employee deleted successfully'
        ]);
    }

      public function BulkRegisterEmployeeLight(Request $request)
    {
        $validated = $request->validate([
            'employees' => 'required|array|min:1',
            'employees.*.employee_id' => 'required|string',
            'employees.*.first_name' => 'required|string|max:255',
            'employees.*.last_name' => 'required|string|max:255',
            'employees.*.account_email' => 'nullable|email',
            'employees.*.account_password' => 'nullable|string|min:6',
            'employees.*.middle_name' => 'nullable|string|max:255',
            'employees.*.department' => 'nullable|string|max:255',
            'employees.*.position' => 'nullable|string|max:255',
            'employees.*.birthdate' => 'nullable|date',
            'employees.*.profile_image' => 'nullable|string',
            'employees.*.email' => 'nullable|email',
            'employees.*.phone' => 'nullable|string|max:15',
            'employees.*.address' => 'nullable|string|max:255',
        ]);

        $results = [
            'created' => [],
            'errors' => [],
            'total' => count($validated['employees']),
        ];

        foreach ($validated['employees'] as $index => $employee) {
            $rowNumber = $index + 1;

            try {
                // Check unique employee_id
                if (EmployeeAccount::where('employee_id', $employee['employee_id'])->exists()) {
                    throw new \Exception("Employee ID '{$employee['employee_id']}' already exists");
                }

                // Check unique account_email if provided
                if (!empty($employee['account_email']) && 
                    EmployeeAccount::where('account_email', $employee['account_email'])->exists()) {
                    throw new \Exception("Account email '{$employee['account_email']}' already exists");
                }

                DB::beginTransaction();

                // Generate default values for missing required fields
                $accountEmail = $employee['account_email'] ?? strtolower($employee['first_name'] . '.' . $employee['last_name'] . '@company.com');
                
                // Ensure unique generated email
                $baseEmail = $accountEmail;
                $counter = 1;
                while (EmployeeAccount::where('account_email', $accountEmail)->exists()) {
                    $parts = explode('@', $baseEmail);
                    $accountEmail = $parts[0] . $counter . '@' . $parts[1];
                    $counter++;
                }

                $plainPassword = $employee['account_password'] ?? 'Welcome123';
                $hashedPassword = bcrypt($plainPassword);

                // Create Account
                $account = EmployeeAccount::create([
                    'employee_id' => $employee['employee_id'],
                    'account_email' => $accountEmail,
                    'account_password' => $hashedPassword,
                ]);

                // Create Information with defaults
                EmployeeInformation::create([
                    'employee_id' => $employee['employee_id'],
                    'first_name' => $employee['first_name'],
                    'middle_name' => $employee['middle_name'] ?? null,
                    'last_name' => $employee['last_name'],
                    'department' => $employee['department'] ?? 'Unassigned',
                    'position' => $employee['position'] ?? 'Staff',
                    'birthdate' => $employee['birthdate'] ?? '2000-01-01',
                    'profile_image' => $employee['profile_image'] ?? 'default.jpg',
                ]);

                // Create Contact with defaults
                EmployeeContact::create([
                    'employee_id' => $employee['employee_id'],
                    'email' => $employee['email'] ?? $accountEmail,
                    'phone_number' => $employee['phone'] ?? 'Not provided',
                    'address' => $employee['address'] ?? 'Not provided',
                ]);

                DB::commit();

                // Send email notification (non-blocking)
                try {
                    Mail::to($accountEmail)->send(
                        new AttendanceNotification([
                            'first_name' => $employee['first_name'],
                            'last_name' => $employee['last_name'],
                            'email' => $accountEmail,
                            'password' => $plainPassword,
                            'employee_id' => $employee['employee_id'],
                            'department' => $employee['department'] ?? 'Unassigned',
                            'position' => $employee['position'] ?? 'Staff',
                        ])
                    );
                } catch (\Exception $e) {
                    \Log::warning("Bulk register email failed: " . $e->getMessage());
                }

                $results['created'][] = [
                    'row' => $rowNumber,
                    'employee_id' => $employee['employee_id'],
                    'name' => $employee['first_name'] . ' ' . $employee['last_name'],
                ];

            } catch (\Exception $e) {
                DB::rollBack();
                $results['errors'][] = [
                    'row' => $rowNumber,
                    'employee_id' => $employee['employee_id'] ?? 'Unknown',
                    'error' => $e->getMessage(),
                ];
            }
        }

        $successCount = count($results['created']);
        $errorCount = count($results['errors']);

        return response()->json([
            'success' => $successCount > 0,
            'message' => "Processed: {$successCount} created, {$errorCount} failed",
            'results' => $results,
        ], $successCount > 0 ? 201 : 422);
    }
}