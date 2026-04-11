<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;  
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

use App\Models\FlagCeremony;

class ScheduleCeremony extends Controller
{
    public function CreateSchedule(Request $request)
    {
        // Convert time format if needed
        $startTime = $request->flag_ceremony_start;
        $endTime = $request->flag_ceremony_end;
        
        // If time is in 12-hour format (e.g., "07:00 AM"), convert to 24-hour
        if (strpos($startTime, 'AM') !== false || strpos($startTime, 'PM') !== false) {
            $startTime = Carbon::parse($startTime)->format('H:i');
            $endTime = Carbon::parse($endTime)->format('H:i');
        }
        
        $validated = $request->validate([
            "flag_ceremony_date"  => "required|date",
            "flag_ceremony_start" => "required",
            "flag_ceremony_end"   => "required",
            "status"              => "required|in:pending,cancelled,completed",
        ]);
        
        // Reassign converted times
        $validated['flag_ceremony_start'] = $startTime;
        $validated['flag_ceremony_end'] = $endTime;
        
        // Additional validation for time format and order
        try {
            $startTimeObj = Carbon::createFromFormat('H:i', $validated['flag_ceremony_start']);
            $endTimeObj = Carbon::createFromFormat('H:i', $validated['flag_ceremony_end']);
            
            if ($endTimeObj <= $startTimeObj) {
                return response()->json([
                    'message' => 'End time must be after start time'
                ], 422);
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Invalid time format. Please use HH:MM format (24-hour)'
            ], 422);
        }

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
    
    public function DeleteSchedule(Request $request)
    {
        $id = $request->flag_ceremony_id;
        $response = FlagCeremony::where('flag_ceremony_id', $id)->delete();
        return response()->json([
            'message' => 'Schedule deleted successfully',
            'success' => true
        ]);
    }
}