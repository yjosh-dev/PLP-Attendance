<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class testController extends Controller
{
    public function TestController(Request $request){
        // FETCH ID VIA TOKEN
       $token = $request->user();
       $id =$token['employee_id'];

       

       return response()->json([$id]);
    }
}
