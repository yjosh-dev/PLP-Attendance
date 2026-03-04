<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;  

use App\Models\EmployeeAccount;
use App\Models\EmployeeInformation;
use App\Models\EmployeeContact;

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
        // HASH PASSWORD
        $validated['account_password'] = bcrypt($validated['account_password']);

        // HANDLE PROFILE IMAGE
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
            'department' => $validated['department'],
            'position'   => $validated['position'],
            'birthdate'     => $validated['birthdate'],
            'profile_image' => $validated['profile_image'] ?? 'default.jpg',
        ]);

        EmployeeContact::create([
            'employee_id' => $validated['employee_id'],
            'email'       => $validated['email'],
            'phone_number'       => $validated['phone'],
            'address'     => $validated['address'],
        ]);

        DB::commit();

        return response()->json([
            'message' => 'Employee registered successfully',
            'data'    => $account
        ], 201);

    } catch (\Exception $e) {
        DB::rollBack();

        return response()->json([
            'message' => 'Registration failed',
            'error'   => $e->getMessage()
        ], 500);
    }
    }

    public function DeleteEmployee(Request $request){
       $validated = $request->validate([
           "employee_id" => "required|exists:employee_account,employee_id"
       ]);
    
       EmployeeAccount::where('employee_id', $validated['employee_id'])->delete();

       return response()->json("success");
    }
}
