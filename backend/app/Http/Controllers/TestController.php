<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;  

class TestController extends Controller
{
    public function sendHello(Request $request) {
        // GET REQUEST BODY
        $email = $request->input('email');
        $password = $request->input('password');
       
        // CHECK IF REQUEST BODY IS EMPTY
        if(empty($email) && empty($password)) {
              return response()->json(['message' => 'Empty email or password. Please try again', 'status' => 401]);
        }

        // CHECK IF THE ACCOUNT CREDENTIAL EXIST IN THE DB
        $exist = DB::table('test_table')
            ->where('account_email', $email)
            ->where('account_password', $password)
            ->exists();
 
        // GET THE SELECTED ACCOUNT INFO
        $user = DB::table('test_table')
            ->where('account_email', $email)
            ->where('account_password', $password)
            ->first();

        if ($exist) {
            return response()->json(['data' => $user, 'message' => 'Login Successful', 'status' => 200]);
        }
        return response()->json(['message' => 'Invalid account password or email. Please try again', 'status' => 401]);
    }
}