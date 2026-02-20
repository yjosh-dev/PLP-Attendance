<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\loginController    ;

Route::get('/testy', function () {
    return response()->json([
        'message' => 'API is working'
    ]);
});

Route::post('/login', [loginController::class, 'Login']);