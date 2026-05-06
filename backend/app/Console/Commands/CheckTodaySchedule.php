<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;

use App\Models\FlagCeremony;

class CheckTodaySchedule extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-today-schedule';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'RUNS EVERY 5AM TO CHECK FOR TODAYS SCHEDULE START AND END';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $scheduleTodayExist = $this->getScheduleToday();

        if($scheduleTodayExist){
           
        }
    }

    private function getDateToday(){
        return Carbon::now('Asia/Manila')->format('Y-m-d');
    }

    private function getScheduleToday(){
        $today = $this->getDateToday();
        return FlagCeremony::where('flag_ceremony_date', $today)
                           ->first();
    }
}
