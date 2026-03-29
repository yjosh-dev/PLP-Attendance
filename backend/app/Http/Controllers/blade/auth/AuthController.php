<?php

namespace App\Http\Controllers\blade\auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthController extends Controller
{
   public function ShowLogin(){
      return view('auth.login');
   }
}
