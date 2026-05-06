<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\blade\auth\AuthController;
use App\Http\Controllers\blade\EmployeeController;
use App\Http\Controllers\blade\index;
use App\Http\Controllers\blade\employee\HomeController;
use App\Http\Controllers\blade\employee\AppealController;


Route::get('/login', [AuthController::class, 'ShowLogin'])->name('login');
Route::post('/login/employee', [AuthController::class, 'handleLogin']);

Route::get('/home', [index::class, 'ShowApp']);
Route::get('/profile', [HomeController::class, 'ShowHome']);

Route::post('/save_appeal', [AppealController::class, 'CreateAppeal']);

Route::get('/debug-session', function() {
    dd(session('employee_data'));
});

