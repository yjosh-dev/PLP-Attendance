<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;

use App\Models\FlagCeremony;

class testController extends Controller
{
    public function TestController(Request $request){

        // get current date
        $date_now = Carbon::now();
        $now = $date_now->format('Y-m-d');
        $time = $date_now->format('t');

        // fetch latest pending schedule\
        $unformatted_schedule = FlagCeremony::orderBy('flag_ceremony_date', 'asc')
                       ->where('status', 'pending')
                       ->select("flag_ceremony_date")
                       ->first();

        // fetch time 
        $scheduled_time = FlagCeremony::orderBy('flag_ceremony_date', 'asc')
                       ->where('status', 'pending')
                       ->select("flag_ceremony_start")
                       ->first();
    
     
       return response()->json($scheduled_time->flag_ceremony_start <= $date_now->toTimeString());

    }
}
