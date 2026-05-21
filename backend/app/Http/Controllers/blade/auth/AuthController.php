<?php

namespace App\Http\Controllers\blade\auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

use App\Models\EmployeeAccount;

class AuthController extends Controller
{
    public function ShowLogin()
    {
        return view('auth.login');
    }

    public function handleLogin(Request $request)
    {
        $validated = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|max:20',
        ]);

        $login = $this->compareHashedPassword($validated['email'], $validated['password']);

        if (!$login) {
            return back()->withErrors([
                'email' => 'Invalid email or password.',
            ]);
        }

        return $login;
    }

    private function fetchAccount($email)
    {
        return EmployeeAccount::where('account_email', $email)->first();
    }

    private function compareHashedPassword($email, $password)
    {
    $account = $this->fetchAccount($email);

    if (!$account) {
        return false;
    }

    if (Hash::check($password, $account->account_password)) {
        $employee = EmployeeAccount::find($account->employee_id);
        $result = DB::table('flag_ceremony_record as fcr')
                    ->join('employee_account_information as eai', 'fcr.employee_id', '=', 'eai.employee_id')
                    ->join('flag_ceremony as fc', 'fc.flag_ceremony_id', '=', 'fcr.flag_ceremony_id')
                    ->select(
                        'fcr.record_id',
                        'fc.flag_ceremony_id',
                        'fcr.employee_id',
                        'fc.flag_ceremony_date',
                        'fcr.time_in',
                        'fcr.time_out',
                        'fcr.status'
                    )
                    ->where('eai.employee_id', $account->employee_id)
                    ->get();

        // Wrap in a collection so the blade can always @forelse properly
        $history = collect(
            $employee->history instanceof \Illuminate\Database\Eloquent\Model
                ? [$employee->history]   // hasOne → single model → wrap it
                : ($employee->history ?? []) // hasMany → already a collection
        )->filter();

        $present     = $history->where('status', 'present')->count();
        $total       = $history->count();
        $percent     = $total ? round($present / $total * 100) : 0;

        return view('layout.index', [
            'information' => $employee->information,
            'contact'     => $employee->contact,
            'history'     => $result,
            'appeals'     => collect(),
            'grade'       => $this->computeGrade($percent),
            'rate'        => number_format($percent, 1),
            'ratePercent' => $percent,
            'rateSummary' => "{$present} Present / {$total} Total Days",
        ]);
     }
      return false;
    }

    private function computeGrade(int $percent): string
    {
        return match(true) {
            $percent >= 97 => 'A+',
            $percent >= 93 => 'A',
            $percent >= 90 => 'A-',
            $percent >= 87 => 'B+',
            $percent >= 83 => 'B',
            $percent >= 80 => 'B-',
            $percent >= 77 => 'C+',
            $percent >= 73 => 'C',
            $percent >= 70 => 'C-',
            default        => 'F',
        };
    }
}