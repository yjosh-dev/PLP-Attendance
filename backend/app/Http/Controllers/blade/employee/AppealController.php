<?php

namespace App\Http\Controllers\blade\employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\FlagCeremonyRecord;
use App\Models\FlagCeremony;
use App\Models\EmployeeAppeal;

class AppealController extends Controller
{
    public function CreateAppeal(Request $request) {
      $data = $request->validate([
           'employee_id' => 'required',
           'date_excused' => 'required|date',
           'reason' => 'required|max:255',
           'note' => 'required',
           'proof_image'  => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
      ]);

      $path = $request->file('proof_image')->store('appeals', 'public');

      EmployeeAppeal::create([
           'employee_id' => $data['employee_id'],
           'date_excused' => $data['date_excused'],
           'reason' => $data['reason'],
           'note' => $data['note'],
           'proof_image' => $path,
      ]);

      return response()->json([
        'success' => true,
        'message' => 'Employee attendance appeal successfully created.'
      ], 200);
    }

    
    private function CheckCeremony($date){
        return FlagCeremony::where('flag_ceremony_date', $date)
                             ->first();
    }

    private function CheckEmployeeAttendance($employee_id, $date){
       $ceremony_data = $this->CheckCeremony($date);
       return FlagCeremonyRecord::where('flag_ceremony_id',$ceremony_data['flag_ceremony_id'])
                                 ->where('employee_id', $employee_id)
                                 ->first();
    }

     public function AcceptAppeal(Request $request){
        $data = $request->validate([
            'employee_id' => 'required',
            'date_excused' => 'required',
            'id' => 'required'
        ]);

        $
        $alreadyAbsent = $this->CheckEmployeeAttendance($data['employee_id'], $data['date_excused']); 

        if($alreadyAbsent){
            return "update";
            /*
            FlagCeremonyRecord::where('flag_ceremony_id', $alreadyAbsent['flag_ceremony_id'])
                              ->update(['status' => "excused"]);

            EmployeeAppeal::where('id', $data['id'])
                          ->update(['status' => "accepted"]);

            return response()->json([
                "success" => true,
                "message" => "Employee appeal successfully approved"
            ]);
            */
        }else{
            return $alreadyAbsent;
            /*
            FlagCeremonyRecord::create([
                "flag_ceremony_id" =>  $alreadyAbsent['flag_ceremony_id'],
                "employee_id" => $data['employee_id'],
                "status" => "excused"
            ]);
            
            EmployeeAppeal::where('id', $data['id'])
                          ->update(['status' => "accepted"]);

            return response()->json([
                "success" => true,
                "message" => "Employee appeal successfully approved"
            ]);
            */
        }

    }

    public function RejectAppeal(){
   
    }

    public function GetAllAppeal(){
       return EmployeeAppeal::with('account')->get();
    }
}
