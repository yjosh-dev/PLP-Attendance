<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;  // Add this import!

class TestController extends Controller
{
    public function sendHello() {
        // Fix 1: Remove the ['active'] parameter since you're not using placeholders
        $test = DB::select('SELECT * FROM test_table');
        
        // Fix 2: Complete the return statement
        return response()->json($test);
    }
}