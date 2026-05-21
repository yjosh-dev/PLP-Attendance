<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EmployeeAccount;
use App\Models\EmployeeInformation;
use App\Models\FlagCeremony;
use App\Models\FlagCeremonyRecord;

use Illuminate\Support\Facades\DB;

class testi extends Controller
{
   public function test(Request $request){
    $request->validate([
        'flag_ceremony_date'  => 'required|date',
        'flag_ceremony_start' => 'required',
        'flag_ceremony_end'   => 'required',
        
    ]);

    $ceremony = FlagCeremony::create([
        'flag_ceremony_date'  => $request->flag_ceremony_date,
        'flag_ceremony_start' => $request->flag_ceremony_start,
        'flag_ceremony_end'   => $request->flag_ceremony_end,
        'status'              => 'pending',
        'created_by'          => 1
    ]);

    $employees = EmployeeInformation::all('employee_id');

      $records = $employees->map(fn($e) => [
        'flag_ceremony_id' => $ceremony->flag_ceremony_id,
        'employee_id'      => $e->employee_id,
        'status'           => 'pending',
        'time_in'          => null,
        'time_out'         => null,
      ])->toArray();

      FlagCeremonyRecord::insert($records);

      return response()->json([
        'message'        => 'Flag ceremony scheduled successfully.',
        'flag_ceremony'  => $ceremony,
        'records_created' => count($records),
      ], 201);
    }
}
