<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use App\Models\FlagCeremony;

class MidnightMessage extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:midnight-message';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
{
    try {
        $now = Carbon::now();

        $next = FlagCeremony::where('flag_ceremony_date', '>=', $now->toDateString())
            ->where('status', 'pending')
            ->orderBy('flag_ceremony_date', 'asc')
            ->orderBy('flag_ceremony_start', 'asc')
            ->first();

        if (!$next) {
            Log::info('[MIDNIGHT JOB] No upcoming schedule found');
            $this->info('No upcoming schedule found');
            return;
        }

        $ceremonyStart = Carbon::parse(
            $next->flag_ceremony_date . ' ' . $next->flag_ceremony_start
        );

        $diff = $now->diff($ceremonyStart);

        Log::info('[MIDNIGHT JOB] Next schedule fetched successfully', [
            'flag_ceremony_id'    => $next->flag_ceremony_id,
            'flag_ceremony_date'  => $next->flag_ceremony_date,
            'flag_ceremony_start' => $next->flag_ceremony_start,
            'flag_ceremony_end'   => $next->flag_ceremony_end,
            'status'              => $next->status,
            'countdown' => [
                'days'    => $diff->days,
                'hours'   => $diff->h,
                'minutes' => $diff->i,
                'seconds' => $diff->s,
                'is_past' => $ceremonyStart->isPast(),
            ]
        ]);

        $this->info('Next schedule logged successfully');

    } catch (\Exception $e) {
        Log::error('[MIDNIGHT JOB] Failed to fetch next schedule', [
            'error' => $e->getMessage()
        ]);

        $this->info('Failed to fetch schedule: ' . $e->getMessage());
    }
    }
}
