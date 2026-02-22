<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;  

// MODELS 
use App\Models\SystemAccount;
use App\Models\SystemAccountInformation;


class RegisterSystemAccount extends Controller
{
    public function InsertSysAccountRecord(Request $request) {
 
         // EXTRACT AND VALIDATE REQUEST BODY
         $validated = $request->validate([
            'account_email' => 'required|email|unique:system_account,account_email',
            'account_password' => 'required|min:8',
            'user_type' => 'required|in:administrator,hr',
            'first_name' => 'required|string|max:100',
            'middle_name' => 'nullable|string|max:100',
            'last_name' => 'required|string|max:100',
         ]);

         // INITIALIZE TRANSACTION 
         try {
            DB::transaction(function() use ($validated) {
               
               //PHASE 1: INSERT INTO SYSTEM_ACCOUNT TABLE
               $account = SystemAccount::create([
                  'account_email' => $validated['account_email'],
                  'account_password' => bcrypt($validated['account_password']),
                  'user_type' => $validated['user_type'],
               ]);
               
              //PHASE 2: INSERT INTO SYSTEM_ACCOUNT TABLE
               SystemAccountInformation::create([
                  'employee_id' => $account->employee_id,
                  'first_name' => $validated['first_name'],
                  'middle_name' => $validated['middle_name'],
                  'last_name' => $validated['last_name'],
               ]);
            });

            return response()->json([
              'message' => "Account {$validated['first_name']} {$validated['last_name']} has been created"
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
              'message' => 'Something went wrong', 'error' => $e->getMessage()
            ], 500);
        }
    }
}
