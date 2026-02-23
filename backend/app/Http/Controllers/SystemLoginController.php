<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash; 
use Illuminate\Support\Facades\RateLimiter; 

use  App\Models\SystemAccount;

class SystemLoginController extends Controller
{
    public function systemLogin(Request $request) {
        
        // 1. Extract and validate request body
        $validated = $request->validate([
               'account_email' => 'required|email',
               'account_password' => 'required|min:8|max:255'
        ]);
      
        
        // 2. Check login attempts for rate limiting 
         $key = 'login' . $validated['account_email'];

         if(RateLimiter::tooManyAttempts($key, 5)) {
            $seconds =  RateLimiter::availableIn($key);
            return response()->json([
                "success" => false,
                "message" => "Too many login attempts. Try again in {$seconds} seconds."
            ], 429);
         }

         // 3. USE ORM & QUERY BUILDER FOR DB OPERATION
         $user = SystemAccount::where('account_email', $validated['account_email'])
                              ->first();

         if(!$user || !Hash::check($validated['account_password'], $user->account_password) ) {
            // Increment attempts counter and set expiration time 
            RateLimiter::hit($key, 300); 
            return response()->json([
                "success" => false,
                "message" => "Invalid credentials. Please try again"
            ], 401);
         }
        
         // 4. Return response upon success and clear attempts
         RateLimiter::clear($key); 
         return response()->json([
              "success" => true,
              "message" => "Account successfully logged in.",
              "id" => $user->employee_id
         ], 200);
         
    }
}
