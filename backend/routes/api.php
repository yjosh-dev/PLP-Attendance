<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;  

use App\Http\Controllers\RegisterSystemAccount;
use App\Http\Controllers\SystemLoginController;
use App\Http\Controllers\TestPostController;
use App\Http\Controllers\FetchUserDetails;
use App\Http\Controllers\RegisterEmployee;
use App\Http\Controllers\FetchAllEmployees;
use App\Http\Controllers\ScheduleCeremony;
use App\Http\Controllers\FetchSchedule;
use App\Http\Controllers\EmployeeAttendance;

use App\Http\Controllers\testController;

use App\Http\Controllers\blade\auth\AuthController;

Route::get('/test', function () {
    return response()->json([
        'message' => 'API is working'
    ]);
});


Route::post('/testpost', [TestPostController::class, 'TestPost']);

Route::post('/reg_system_account', [RegisterSystemAccount::class, 'InsertSysAccountRecord']);
Route::post('/login', [SystemLoginController::class, 'SystemLogin']);   

// Protected api endpoint via sanctum middleware
Route::middleware('auth:sanctum')->group(function() {
    Route::post('/logout', [SystemLoginController::class, 'SystemLogout']);
    Route::post('/register_employee', [RegisterEmployee::class, 'RegisterEmployee']);
    Route::post('/delete_employee', [RegisterEmployee::class, 'DeleteEmployee']);
    Route::post('/attendance', [EmployeeAttendance::class, 'attendanceTimeIn']);
    Route::post('/create_schedule', [ScheduleCeremony::class, 'CreateSchedule']);
    Route::delete('/delete_schedule', [ScheduleCeremony::class, 'DeleteSchedule']);
    Route::get('/fetch_employees', [FetchAllEmployees::class, 'fetchAllEmployees']);
    Route::get('/fetch-user', [FetchUserDetails::class, 'fetchUser']);
    Route::get('/fetch_schedules', [FetchSchedule::class, 'FetchAllSchedule']);
    Route::get('/fetch_next_ceremony', [FetchSchedule::class, 'FetchNextSchedule']);
    Route::get('/me', function (Request $request) {
        return response()->json(["message" => "authenticated"]);
    });
});
