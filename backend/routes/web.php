<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\blade\auth\AuthController;

Route::get('/login', [AuthController::class, 'ShowLogin']);

Route::prefix('employee')->as('employee.')->group(function () {
   Route::post('/login', [AuthController::class, 'handleLogin']);
});