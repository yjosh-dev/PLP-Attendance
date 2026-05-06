<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Models\FlagCeremonyRecord;

class MonitorController extends Controller
{
    public function Index(){
        $ceremony_record = $this->FetchCeremony();
        $present = $this->FetchPresent();
        $absent = $this->FetchAbsent();

        return response()->json([
            "ceremony_record" => $ceremony_record,
            "attendance_by_status" => [
                "present" => $present,
                "absent" => $absent
            ]
        ]);
    }

    private function FetchDate(){
        return "2026-04-12";
        //Carbon::now()->format("Y-m-d")
    }

    private function FetchCeremony(){
        $now = $this->FetchDate();
        $test = DB::table('flag_ceremony')
          ->join('flag_ceremony_record', 'flag_ceremony.flag_ceremony_id', '=', 'flag_ceremony_record.flag_ceremony_id')
          ->join('employee_account_information', 'flag_ceremony_record.employee_id', '=', 'employee_account_information.employee_id')
          ->where('flag_ceremony.flag_ceremony_date', $now)
          ->select(
             'employee_account_information.first_name', 'employee_account_information.last_name', 'employee_account_information.department', 
             'flag_ceremony_record.status'
             )
          ->get();
        return $test;
    }

    private function FetchPresent(){
         $now = $this->FetchDate();
         return DB::table('flag_ceremony')
          ->join('flag_ceremony_record', 'flag_ceremony.flag_ceremony_id', '=', 'flag_ceremony_record.flag_ceremony_id')
          ->join('employee_account_information', 'flag_ceremony_record.employee_id', '=', 'employee_account_information.employee_id')
          ->where('flag_ceremony.flag_ceremony_date', $now)
          ->select('flag_ceremony_record.status', DB::raw('COUNT(*) as total'))
          ->groupBy('flag_ceremony_record.status')
          ->pluck('total', 'status');
    }

    private function FetchAbsent(){
      $absent = DB::table('employee_account as ea')
        ->join('flag_ceremony as fc', 'fc.flag_ceremony_date')
        ->where('fc.flag_ceremony_date', $now)
        ->leftJoin('flag_ceremony_record as fcr', function($join) {
          $join->on('ea.employee_id', '=', 'fcr.employee_id')
             ->on('fcr.flag_ceremony_id', '=', 'fc.flag_ceremony_id');
         })
        ->whereNull('fcr.employee_id')
        ->select('ea.*')
        ->get();
 
       return $absent;
    }
}
