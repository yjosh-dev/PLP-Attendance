<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;  
use Illuminate\Support\Facades\Hash;  

class SystemLoginController extends Controller
{
    public function SystemLogin(Request $request) {

        // VALIDATE REQUEST BODY
        $validated = $request->validate([
            'account_email' => 'required|email',
            'account_password' => 'required|min:8'
        ]);

        try {
          DB::transac(function () {

          });
        }catch(Exception $e){

        }

        
    }
}
