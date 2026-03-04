<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;  

class FetchAllEmployees extends Controller
{
    public function fetchAllEmployees(){
        $records = DB::table('employee_account as ea')
                ->select(
                    'ea.employee_id',
                    'ea.account_email',
                    'eai.first_name',
                    'eai.middle_name',
                    'eai.last_name',
                    "eai.profile_image",
                    "eai.department",
                    "eai.position",
                    "eac.phone_number",
                )
                ->join('employee_account_information as eai', 'ea.employee_id', '=', "eai.employee_id")
                ->join('employee_account_contact as eac', 'eac.employee_id', "=", "ea.employee_id")
                ->get();

        return response()->json(["data" => $records]);
    }
}
