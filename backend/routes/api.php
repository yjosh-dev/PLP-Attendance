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
use App\Http\Controllers\MonitorController;
use App\Http\Controllers\AnalyticsController;

use App\Http\Controllers\testController;
use App\Http\Controllers\testi;

use App\Models\EmployeeAccount;

use App\Http\Controllers\blade\employee\AppealController;

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

Route::post('/employees/bulk', [RegisterEmployee::class, 'BulkRegisterEmployeeLight']);
Route::get('/appeal', [AppealController::class, 'GetAllAppeal']);
Route::post('/save_appeal', [AppealController::class, 'CreateAppeal']);
 Route::post('/attendance', [EmployeeAttendance::class, 'attendanceTimeIn']);
Route::post('/accept_appeal', [AppealController::class, 'AcceptTheAppeal']);
Route::get('/fetch_monitoring_dash', [MonitorController::class, 'Index']);
Route::post('/mark_absent', [EmployeeAttendance::class, 'MarkAbsent']);
Route::get('/analytics/flag-ceremony/current', [AnalyticsController::class, 'current']);
Route::get('/analytics/flag-ceremony/events', [AnalyticsController::class, 'events']);
Route::get('/analytics/flag-ceremony/current', [AnalyticsController::class, 'current']);
Route::get('/analytics/flag-ceremony/latest', [AnalyticsController::class, 'latest']);
Route::get('/analytics/flag-ceremony/date/{date}', [AnalyticsController::class, 'showByDate']);
Route::get('/analytics/flag-ceremony/range', [AnalyticsController::class, 'showByDateRange']);
Route::get('/analytics/flag-ceremony/{id}', [AnalyticsController::class, 'show']);
Route::post('/hello_test', [testi::class, 'test']);