<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TestPostController extends Controller
{
    public function TestPost(Request $request) {

        $email = $request->input('account_email');
        $password = $request->input('account_password');

        return response()->json([
            "message" => "Error"
        ], 401);
    }
}
