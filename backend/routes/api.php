<?php

use Illuminate\Support\Facades\Route;


use App\Http\Controllers\RegisterSystemAccount;
use App\Http\Controllers\SystemLoginController;


Route::get('/testy', function () {
    return response()->json([
        'message' => 'API is working'
    ]);
});

Route::post('/login', [loginController::class, 'Login']);
Route::post('/reg_system_account', [RegisterSystemAccount::class, 'InsertSysAccountRecord']);
Route::post('/login', [SystemLoginController::class, 'systemLogin']);