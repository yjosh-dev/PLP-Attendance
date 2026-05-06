<?php

namespace App\Http\Controllers\blade\employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function ShowHome(){
        return view('employee.home');
    }
}
