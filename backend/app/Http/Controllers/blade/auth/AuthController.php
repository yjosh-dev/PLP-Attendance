<?php

namespace App\Http\Controllers\blade\auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

use App\Models\EmployeeAccount;

class AuthController extends Controller
{
   public function ShowLogin(){
      return view('auth.login');
   }

   public function handleLogin(Request $request) {

        $validated = $request->validate([
              "email" => "required|email",
              "password" => "required|max:20"
        ]);

        $login = $this->compareHashedPassword($validated['email'], $validated['password']);
        if(!$login){
           return back()->withErrors([
             'email' => 'Invalid email or password.'
           ]);
        }

        return $login;
   
   }

   private function fetchAccount($email){
       return EmployeeAccount::where('account_email', $email)
                                         ->first();
   }

   public function compareHashedPassword($email, $password){
       $account = $this->fetchAccount($email);
       if(!$account){
          return false;
       }

       if(Hash::check($password, $account->account_password)){
          //placeholder for proper http response + token
           return "success";
       }
       return false;
   }
}
