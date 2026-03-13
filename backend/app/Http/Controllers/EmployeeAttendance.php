<?php

namespace App\Http\Controllers;


use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;  

use App\Models\FlagCeremony;
use App\Models\FlagCeremonyRecord;

use App\DTO\ScheduleDataDTO;

class EmployeeAttendance extends Controller
{
    public function attendanceTimeIn(Request $request) {
       // check first if the employee exist
       $userExist = $this->fetchUser($request->input('employee_id'));
       if(!$userExist){
          return response()->json([
             "success" => false,
             "message" => "User doesn't exist! Please try again"
          ], 404);
       }
       
       // check if theres ceremony today
       $haveCeremonyToday = $this->checkDate();
       if(!$haveCeremonyToday){
          return response()->json([
             "success" => false,
             "message" => "No upcoming flag ceremony"
          ], 400);
       }

      // check if on time
       $OnTime = $this->checkTime();
       if($OnTime){
          return response()->json([
             "success" => false,
             "message" => "Too late or too early"
          ], 400);
       }
    }

    private function fetchUser($employee_id){   
      $user = DB::table('employee_account as ea')
                    ->select(
           'ea.employee_id',
                    'ea.account_email',
                    'eai.first_name',
                    'eai.middle_name',
                    'eai.last_name',
                    "eai.profile_image",
                    "eai.department",
                    "eai.position",
                    "eac.phone_number",)
                    ->join('employee_account_information as eai', 'ea.employee_id', '=', "eai.employee_id")
                    ->join('employee_account_contact as eac', 'eac.employee_id', "=", "ea.employee_id")
                    ->where('ea.employee_id', '=', $employee_id)
                    ->first();
       return $user;
    }

    private function fetchNextSchedule() {
       $now = Carbon::now('Asia/Manila');
       $nextSchedule = FlagCeremony::orderBy('flag_ceremony_date', 'asc')
                                ->select('flag_ceremony_date', 'flag_ceremony_start')
                                ->where('status', 'pending')
                                ->firstOrFail();
       return $data = array("now" => $now, "start_date" => $nextSchedule['flag_ceremony_date'], "start_time" => $nextSchedule['flag_ceremony_start']);
    }

    public function checkDate() {
      try{
         $data = $this->fetchNextSchedule();
         $now = Carbon::parse($data['now'])->format('Y-m-d');
         $start_date = $data['start_date'];

         return $start_date == $now;

      }catch(ModelNotFoundException $e){
         
      }
      
    }

    public function checkTime(){
       $data = $this->fetchNextSchedule();
      
       // for reference its seconds AFTER midnight

      // for current time
       $raw_time = Carbon::parse($data['now'])->format('H:i:s');
       $time_now = Carbon::parse($raw_time);
       $seconds_now = ($time_now->hour * 3600) + ($time_now->minute * 60) + $time_now->second; // ← was $time, should be $time_now

       // for actual start
       $time = $data['start_time'];
       $seconds_start = strtotime($time) - strtotime('TODAY');+
     
       // for start accepting (2 hours before)
  
       $seconds_accepting = $seconds_start - 7200;
  
      // p.s IT WORKS PERFECTLY FINE DONT TOUCH IT
       if($seconds_now < $seconds_start && $seconds_now > $seconds_accepting){
         return true;
       }
       return false;
    }

    public function TimeIn($flag_ceremony_id, $employee_id, $time_in, $first_name){
      try{
        $response = FlagCeremonyRecord::create([
           "flag_ceremony_id" => $flag_ceremony_id,
           "employee_id" => $employee_id,
           "time_in" => $time_in
        ]);

        return response->json([
           "success" => "true",
           "message" => "Employee $first_name timed in at $time_in"
        ], 200);
      
      }catch(err){
        return response->json([
           "success" => "false",
           "message" => "Employee $first_name time in failed"
        ], 400);
      }
    }

    public function TimeOut(){
      
    }
}
