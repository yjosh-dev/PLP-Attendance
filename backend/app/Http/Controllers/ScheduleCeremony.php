<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;  
use Illuminate\Support\Facades\Auth;

use App\Models\FlagCeremony;

class ScheduleCeremony extends Controller
{
  public function CreateSchedule(Request $request){
      $validated = $request->validate([
        "flag_ceremony_date"  => "required|date",
        "flag_ceremony_start" => "required|date_format:H:i",
        "flag_ceremony_end"   => "required|date_format:H:i|after:flag_ceremony_start",
        "status"              => "required|in:pending,cancelled,completed",
      ]);

      try {
        $ceremony = DB::transaction(function() use($validated, $request) {
            return FlagCeremony::create([
                'flag_ceremony_date'  => $validated['flag_ceremony_date'],
                'flag_ceremony_start' => $validated['flag_ceremony_start'],
                'flag_ceremony_end'   => $validated['flag_ceremony_end'],
                'status'              => $validated['status'],
                'created_by'          => $request->user()->employee_id,
            ]);
        });

        return response()->json([
            'message' => 'Flag ceremony scheduled successfully',
            'data'    => $ceremony
        ], 201);

      } catch (\Exception $e) {
        return response()->json([
            'message' => 'Failed to create schedule',
            'error'   => $e->getMessage()
        ], 500);
      }
    }
    public function DeleteSchedule(Request $request){
         $id = $request->flag_ceremony_id;
         $response = FlagCeremony::where('flag_ceremony_id', $id )
                                 ->delete();
         return $response;
    }
}
