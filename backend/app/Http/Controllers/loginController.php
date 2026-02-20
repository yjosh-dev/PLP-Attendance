<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;  

class loginController extends Controller
{
   
    public function CheckAccountExistence($email, $password) {

        return DB::table('test_table')
            ->where('account_email', $email)
            ->where('account_password', $password)
            ->first();
    }

    public function Login (Request $request) {

          // EXTRACT REQUEST BODY
          $email = $request->input('email');
          $password = $request->input('password');


          // SIMPLE VALIDATION ON EXTRACTED REQUEST BODY
          if(empty($email) || empty($password)) {
             return response()->json([
              'status'=> 'Error',
              'message' => "Empty characters. Please try again!"
            ]);
          };
   
         // EXTRACT THE RESULT FROM FUNCTION
          $account = $this->CheckAccountExistence($email, $password);

             if (!$account) {
                return response()->json([
                    'status' => 'Error',
                    'message' => 'Invalid Account. Please try again!'
                ]);
             } 

             return response()->json([
                'status' => 'Success',
                'message' => 'Account information successfully retrieved',
                'data' => $account
             ]);
    }
}
