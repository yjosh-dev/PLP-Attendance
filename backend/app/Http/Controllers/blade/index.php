<?php

namespace App\Http\Controllers\blade;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class index extends Controller
{
    public function ShowIndex(){
       return view('layout.index');
    }
  
    public function ShowApp(){
       return view('layout.app');
    }
}
