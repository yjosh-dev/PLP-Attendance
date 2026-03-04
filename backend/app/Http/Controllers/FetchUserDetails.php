<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\SystemAccount;


class FetchUserDetails extends Controller
{
    public function fetchUser(Request $request) {

        $systemAccount = $request->user();
        
        $systemAccountInfo = $systemAccount->information;

        return response()->json([
             "success" => true,
             "message" => "Data fetched successfully",
             "data" =>  [
                "employee_id" => $systemAccount->employee_id,
                "user_type"   => $systemAccount->user_type,
                "first_name"  => $systemAccountInfo->first_name,
                "middle_name" => $systemAccountInfo->middle_name,
                "last_name"   => $systemAccountInfo->last_name,
             ]
        ]);
    }
}
