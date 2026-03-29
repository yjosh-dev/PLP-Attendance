<?php

use Illuminate\Support\Facades\Route;
use  App\Http\Controllers\blade\auth\AuthController;

Route::get('/login', [AuthController::class, 'ShowLogin']);