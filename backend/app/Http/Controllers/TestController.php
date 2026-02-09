<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TestController extends Controller
{
    public function sendHello() {
        return response()->json(['message' => "Hello world"]);
    }
}
