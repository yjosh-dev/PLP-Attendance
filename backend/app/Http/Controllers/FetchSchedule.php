<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FlagCeremony;
use Carbon\Carbon;

class FetchSchedule extends Controller
{
   public function FetchAllSchedule() {
      try {
        $schedules = FlagCeremony::orderBy('flag_ceremony_date', 'asc')->get();

        return response()->json([
            'message' => 'Schedules fetched successfully',
            'data'    => $schedules
        ], 200);    

      } catch (\Exception $e) {
        return response()->json([
            'message' => 'Failed to fetch schedules',
            'error'   => $e->getMessage()
         ], 500);
      }
    }

   public function FetchNextSchedule() {
    try {
        $now = Carbon::now();
        $next = FlagCeremony::where('flag_ceremony_date', '>=', $now->toDateString())
            ->where('status', 'pending')
            ->orderBy('flag_ceremony_date', 'asc')
            ->orderBy('flag_ceremony_start', 'asc')
            ->first();

        if (!$next) {
            return response()->json([
                'message' => 'No upcoming schedule found',
                'data'    => null
            ], 200);
        }

        $ceremonyStart = Carbon::parse(
            $next->flag_ceremony_date . ' ' . $next->flag_ceremony_start
        );

        // Countdown components
        $diff = $now->diff($ceremonyStart);

        return response()->json([
            'message' => 'Next schedule fetched successfully',
            'data'    => [
                'flag_ceremony_id'    => $next->flag_ceremony_id,
                'flag_ceremony_date'  => $next->flag_ceremony_date,
                'flag_ceremony_start' => $next->flag_ceremony_start,
                'flag_ceremony_end'   => $next->flag_ceremony_end,
                'status'              => $next->status,
                'countdown'           => [
                    'days'    => $diff->days,
                    'hours'   => $diff->h,
                    'minutes' => $diff->i,
                    'seconds' => $diff->s,
                    'is_past' => $ceremonyStart->isPast(),
                ],
            ]
        ], 200);
      } catch (\Exception $e) {
        return response()->json([
            'message' => 'Failed to fetch next schedule',
            'error'   => $e->getMessage()
        ], 500);
      }
    }
}
