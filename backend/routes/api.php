<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\loginController;
use App\Http\Controllers\RegisterSystemAccount;

Route::get('/testy', function () {
    return response()->json([
        'message' => 'API is working'
    ]);
});

Route::post('/login', [loginController::class, 'Login']);
Route::post('/reg_system_account', [RegisterSystemAccount::class, 'InsertSysAccountRecord']);