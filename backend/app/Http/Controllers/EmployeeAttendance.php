<?php

namespace App\Http\Controllers;


use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;  
use Illuminate\Support\Facades\Mail;
use Illuminate\Database\Eloquent\ModelNotFoundException;

use App\Models\FlagCeremony;
use App\Models\FlagCeremonyRecord;
use App\Mail\TimeAttendanceNotification;
use App\DTO\ScheduleDataDTO;

class EmployeeAttendance extends Controller
{
    public function attendanceTimeIn(Request $request) {

       $validated = $request->validate([
         "employee_id" => "required|max:10"
       ]);

       // check first if the employee exist
       $userExist = $this->fetchUser($validated['employee_id']);
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
          ], 404);
       }

      // check if on time
       $OnTime = $this->checkTime();
       if(!$OnTime){
          return response()->json([
             "success" => false,
             "message" => "Too late or too early"
          ], 404);
       }
 
      // check if already completed a attendance
      $check = $this->checkStatus($validated['employee_id']);
      if($check) return $check;
      
      // check ceremony record of employee on current flag ceremony
      // p.s dont mix the function parameter future STUPID ME
      $alreadyDone = $this->FetchEmployeeCeremonyRecord($validated['employee_id'], $haveCeremonyToday['flag_ceremony_id']);
      $flag_ceremony_id = $haveCeremonyToday['flag_ceremony_id'];
      $employee_id = $validated['employee_id'];
      $time_in = $OnTime;
      $first_name = $userExist->first_name;

      $status = $alreadyDone->status;

      if($status === 'pending'){
         $response = $this->TimeIn2($flag_ceremony_id, $employee_id, $time_in, $first_name, $userExist);
         $responseArray = $response->getData(true);
         return $response;
      }else{
         $record_id = $alreadyDone['record_id'];
         $response = $this->TimeOut($record_id, $OnTime, $first_name ,$userExist);
         $responseArray = $response->getData(true);
         return $response;
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
       $nextSchedule = FlagCeremony::orderBy('flag_ceremony_date', 'desc')
                                ->select('flag_ceremony_date', 'flag_ceremony_start', 'flag_ceremony_id')
                                ->where('status', 'pending')
                                ->firstOrFail();
       return $data = array("now" => $now, "start_date" => $nextSchedule['flag_ceremony_date'], "start_time" => $nextSchedule['flag_ceremony_start'], "flag_ceremony_id" => $nextSchedule['flag_ceremony_id']);
    }

    public function checkDate() {
      try{
         $data = $this->fetchNextSchedule();
         $now = Carbon::parse($data['now'])->format('Y-m-d');
         $start_date = $data['start_date'];

         if($start_date == $now){
            return $data;
         }else{
            return false;
         }

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
         return $raw_time;
       }
       return false;
    }

    public function TimeIn2($flag_ceremony_id, $employee_id, $time_in, $first_name, $userExist) {
      try {
        $response = FlagCeremonyRecord::where('flag_ceremony_id', $flag_ceremony_id)
                                      ->where('employee_id', $employee_id)
                                      ->update([
                                          "status"  => "in",
                                          "time_in" => now()
                                      ]);
       return response()->json([
            "success" => true,
            "message" => "Employee $first_name timed in successfully",
            "updated" => $response,
            "data"    => $userExist
        ], 200);
       } catch (\Exception $e) {
          return response()->json([
            "success" => false,
            "message" => "Employee $first_name time in failed",
            "error"   => $e->getMessage()
          ], 400);
        }
   }

   public function TimeIn($flag_ceremony_id, $employee_id, $time_in, $first_name, $userExist) {
      try {
         $response = FlagCeremonyRecord::create([
            "flag_ceremony_id" => $flag_ceremony_id,
            "employee_id"      => $employee_id,
            "time_in"          => $time_in
         ]);
         return response()->json([
            "success" => "true",
            "message" => "Employee $first_name timed in at $time_in",
            "row"     => $response,
            "data"    => $userExist
         ], 200);

         } catch (\Exception $e) {
           return response()->json([
            "success" => "false",
            "message" => "Employee $first_name time in failed",
            "error"   => $e->getMessage()  // helpful for debugging
         ], 400);
        }
   }

   public function TimeOut($record_id, $time_out, $first_name, $userExist) {
       try {
         $response = FlagCeremonyRecord::where('record_id', $record_id)
                                      ->update([
                                       'time_out' => $time_out,
                                       'status'   => 'present',
                                       ]);
                                    
          return response()->json([
              "success" => "true",
              "message" => "Employee $first_name timed out at $time_out",
              "data" =>  $userExist
          ], 200);

       }catch(\Exception $e) {
          return response()->json([
              "success" => "false",
              "message" => "Employee $first_name time out failed",
              "error"   => $e->getMessage()
          ], 400);
       }
    }

    public function FetchEmployeeCeremonyRecord($employee_id, $flag_ceremony_id){
        $response = FlagCeremonyRecord::where('employee_id', $employee_id)
                                     ->where('flag_ceremony_id', $flag_ceremony_id)
                                     ->first();
        return $response;
    }

    public function fetchStatus($employee_id){
        $today = Carbon::today('Asia/Manila')->format('Y-m-d');
        $status = DB::table('flag_ceremony_record')
                    ->join('flag_ceremony', 'flag_ceremony.flag_ceremony_id', '=', 'flag_ceremony_record.flag_ceremony_id')
                    ->select('flag_ceremony_record.status')
                    ->where('flag_ceremony.flag_ceremony_date', $today)
                    ->where('flag_ceremony_record.employee_id', $employee_id)
                    ->first();
        return $status;
    }

    public function checkStatus($employee_id){
      $record = $this->fetchStatus($employee_id);
      $status = $record?->status; // null-safe: returns null if no record found
      switch($status){
         case "present":
         return response()->json([
            "success" => false,
            "message" => "Unable to process. You have already timed-out"
         ], 400);

         case "excused":
         return response()->json([
            "success" => false,
            "message" => "Unable to process. You are already excused"
         ], 400);

         default:
         return;
       }
    }

    public function sendAttendanceEmail($email, $first_name, $time_in, $userExist): void
{
    try {
        Mail::to($email)->send(
            new TimeAttendanceNotification([
                'message'       => "Employee $first_name timed in at $time_in",
                'employee_id'   => $userExist->employee_id,
                'account_email' => $userExist->account_email,
                'first_name'    => $userExist->first_name,
                'middle_name'   => $userExist->middle_name,
                'last_name'     => $userExist->last_name,
                'department'    => $userExist->department,
                'position'      => $userExist->position,
            ])
        );

        Log::info('Attendance email sent to: ' . $email);

    } catch (\Exception $e) {
        Log::error('Failed to send attendance email: ' . $e->getMessage());
    }
  }
  
  public function MarkAbsent(Request $request){
    $data = $request->validate([
        "flag_ceremony_id" => 'required'
    ]);

    try {
        FlagCeremonyRecord::where('flag_ceremony_id', $data['flag_ceremony_id'])
            ->where('status', 'pending')
            ->update(['status' => 'absent']);

        return response()->json([
            "success" => true,
            "message" => "Pending records marked as absent"
        ], 200);
    }catch(\Exception $e) {
       return response()->json([
            "success" => false,
            "message" => "Failed to mark absent",
            "error" => $e->getMessage()
        ], 400);
      }
   }    
}
