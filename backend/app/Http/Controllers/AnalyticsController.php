<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    /**
     * GET /api/analytics/flag-ceremony/current
     *
     * Returns all data for the CURRENT ONGOING flag ceremony (status = 'pending').
     * Falls back to the most recent ceremony today if none is pending.
     * Every key maps 1-to-1 to what the React dashboard consumes.
     */
    public function current(): JsonResponse
    {
        $today = Carbon::today()->toDateString();

        // ── Find the ongoing/most-recent ceremony for today ───────────────────
        $ceremony = DB::table('flag_ceremony')
            ->whereDate('flag_ceremony_date', $today)
            ->orderByRaw("FIELD(status, 'pending', 'completed', 'cancelled')")
            ->first();

        if (! $ceremony) {
            return response()->json([
                'ceremony'        => null,
                'kpis'            => $this->emptyKpis(),
                'timelineSlots'   => $this->emptyTimeline(),
                'statusMix'       => $this->emptyStatusMix(),
                'departmentStats' => [],
                'attendanceLog'   => [],
            ]);
        }

        return $this->buildAnalyticsResponse($ceremony);
    }

    /**
     * GET /api/analytics/flag-ceremony/{id}
     *
     * Returns all analytics data for a SPECIFIC flag ceremony by ID.
     * Useful for viewing past ceremonies or specific ceremony reports.
     */
    public function show($id): JsonResponse
    {
        // ── Find the specific ceremony by ID ───────────────────────────────────
        $ceremony = DB::table('flag_ceremony')
            ->where('flag_ceremony_id', $id)
            ->first();

        if (! $ceremony) {
            return response()->json([
                'error' => 'Ceremony not found',
                'message' => "No flag ceremony found with ID: {$id}"
            ], 404);
        }

        return $this->buildAnalyticsResponse($ceremony);
    }

    /**
     * GET /api/analytics/flag-ceremony/date/{date}
     *
     * Returns analytics data for a flag ceremony on a specific date.
     * Date format: YYYY-MM-DD
     */
    public function showByDate($date): JsonResponse
    {
        // ── Find ceremony by date ──────────────────────────────────────────────
        $ceremony = DB::table('flag_ceremony')
            ->whereDate('flag_ceremony_date', $date)
            ->first();

        if (! $ceremony) {
            return response()->json([
                'error' => 'Ceremony not found',
                'message' => "No flag ceremony found on date: {$date}"
            ], 404);
        }

        return $this->buildAnalyticsResponse($ceremony);
    }

    /**
     * GET /api/analytics/flag-ceremony/latest
     *
     * Returns analytics data for the most recent ceremony (any status).
     */
    public function latest(): JsonResponse
    {
        // ── Find the most recent ceremony ──────────────────────────────────────
        $ceremony = DB::table('flag_ceremony')
            ->orderBy('flag_ceremony_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->first();

        if (! $ceremony) {
            return response()->json([
                'error' => 'No ceremonies found',
                'message' => 'No flag ceremony records exist in the database'
            ], 404);
        }

        return $this->buildAnalyticsResponse($ceremony);
    }

    /**
     * GET /api/analytics/flag-ceremony/range
     *
     * Returns analytics data for ceremonies within a date range.
     * Query params: ?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
     */
    public function showByDateRange(): JsonResponse
    {
        $startDate = request()->query('start_date');
        $endDate = request()->query('end_date');

        if (! $startDate || ! $endDate) {
            return response()->json([
                'error' => 'Missing parameters',
                'message' => 'Both start_date and end_date are required (format: YYYY-MM-DD)'
            ], 400);
        }

        $ceremonies = DB::table('flag_ceremony')
            ->whereBetween('flag_ceremony_date', [$startDate, $endDate])
            ->orderBy('flag_ceremony_date', 'desc')
            ->get();

        if ($ceremonies->isEmpty()) {
            return response()->json([
                'ceremonies' => [],
                'message' => 'No ceremonies found in the specified date range'
            ]);
        }

        // Return summary of all ceremonies in the range
        $summary = [];
        foreach ($ceremonies as $ceremony) {
            $summary[] = [
                'id' => $ceremony->flag_ceremony_id,
                'date' => Carbon::parse($ceremony->flag_ceremony_date)->format('F d, Y'),
                'start' => Carbon::parse($ceremony->flag_ceremony_start)->format('g:i A'),
                'end' => Carbon::parse($ceremony->flag_ceremony_end)->format('g:i A'),
                'status' => ucfirst($ceremony->status),
            ];
        }

        return response()->json([
            'count' => $ceremonies->count(),
            'ceremonies' => $summary,
            'date_range' => [
                'start' => Carbon::parse($startDate)->format('F d, Y'),
                'end' => Carbon::parse($endDate)->format('F d, Y'),
            ],
        ]);
    }

    /**
     * Build the complete analytics response for a given ceremony
     *
     * @param object $ceremony The ceremony object from database
     * @return JsonResponse
     */
    private function buildAnalyticsResponse($ceremony): JsonResponse
    {
        $ceremonyId = $ceremony->flag_ceremony_id;

        // ── 1. Raw records joined with employee info ───────────────────────────
        $records = DB::table('flag_ceremony_record as fcr')
            ->join('employee_account_information as eai', 'fcr.employee_id', '=', 'eai.employee_id')
            ->where('fcr.flag_ceremony_id', $ceremonyId)
            ->select(
                'fcr.record_id',
                'fcr.employee_id',
                DB::raw("CONCAT(eai.first_name, ' ', eai.last_name) AS name"),
                'eai.department',
                'eai.position',
                'fcr.time_in',
                'fcr.time_out',
                'fcr.status'
            )
            ->orderBy('eai.last_name')
            ->get();

        $total    = $records->count();
        $present  = $records->where('status', 'present')->count();
        $absent   = $records->where('status', 'absent')->count();
        $excused  = $records->where('status', 'excused')->count();
        $pending  = $records->where('status', 'pending')->count();
        $earlyOut = $records->where('status', 'early-out')->count();

        // ── 2. KPIs ───────────────────────────────────────────────────────────
        $resolved   = $total - $pending;
        $attendRate = $resolved > 0 ? round(($present / $resolved) * 100, 1) : 0.0;

        $kpis = [
            'total'          => $total,
            'present'        => $present,
            'absent'         => $absent,
            'excused'        => $excused,
            'earlyOut'       => $earlyOut,
            'pending'        => $pending,
            'attendanceRate' => $attendRate,
        ];

        // ── 3. Timeline slots (ceremony start → end, 30-min buckets) ──────────
        $slots = [];
        $cur   = Carbon::parse($ceremony->flag_ceremony_date . ' ' . $ceremony->flag_ceremony_start);
        $end   = Carbon::parse($ceremony->flag_ceremony_date . ' ' . $ceremony->flag_ceremony_end);

        while ($cur->lt($end)) {
            $slots[] = $cur->format('H:i');
            $cur->addMinutes(30);
        }

        $slotCounts = array_fill_keys($slots, 0);

        foreach ($records as $row) {
            if (! $row->time_in) continue;

            $timeIn    = Carbon::parse($ceremony->flag_ceremony_date . ' ' . $row->time_in);
            $slotStart = $timeIn->copy()->floorMinutes(30)->format('H:i');

            if (array_key_exists($slotStart, $slotCounts)) {
                $slotCounts[$slotStart]++;
            } elseif (count($slots) > 0) {
                $slotCounts[$slots[0]]++;
            }
        }

        $cumulative    = 0;
        $timelineSlots = [];

        foreach ($slots as $slot) {
            $arrivals    = $slotCounts[$slot];
            $cumulative += $arrivals;

            $timelineSlots[] = [
                'time'       => Carbon::parse($slot)->format('g:i A'),
                'arrivals'   => $arrivals,
                'cumulative' => $cumulative,
            ];
        }

        // ── 4. Status mix (donut chart) ───────────────────────────────────────
        $statusMix = [
            ['name' => 'Present',   'value' => $present,  'color' => '#22c55e'],
            ['name' => 'Absent',    'value' => $absent,   'color' => '#ef4444'],
            ['name' => 'Excused',   'value' => $excused,  'color' => '#f59e0b'],
            ['name' => 'Early-out', 'value' => $earlyOut, 'color' => '#3b82f6'],
            ['name' => 'Pending',   'value' => $pending,  'color' => '#9ca3af'],
        ];

        // ── 5. Department breakdown ───────────────────────────────────────────
        $departmentStats = $records
            ->groupBy('department')
            ->map(function ($group, $dept) {
                $dTotal   = $group->count();
                $dPresent = $group->where('status', 'present')->count();
                $dAbsent  = $group->where('status', 'absent')->count();
                $dExcused = $group->where('status', 'excused')->count();
                $dPending = $group->where('status', 'pending')->count();
                $resolved = $dTotal - $dPending;

                return [
                    'name'    => $dept,
                    'total'   => $dTotal,
                    'present' => $dPresent,
                    'absent'  => $dAbsent,
                    'excused' => $dExcused,
                    'pending' => $dPending,
                    'rate'    => $resolved > 0
                        ? round(($dPresent / $resolved) * 100, 1)
                        : 0.0,
                ];
            })
            ->values()
            ->toArray();

        // ── 6. Attendance log (client-side sort + filter + print) ─────────────
        $statusLabel = [
            'present'   => 'Present',
            'absent'    => 'Absent',
            'excused'   => 'Excused',
            'early-out' => 'Early-out',
            'pending'   => 'Pending',
        ];

        $attendanceLog = $records->map(fn ($row) => [
            'id'         => (int) $row->record_id,
            'name'       => $row->name,
            'department' => $row->department,
            'position'   => $row->position,
            'timeIn'     => $row->time_in  ? Carbon::parse($row->time_in)->format('h:i A')  : '—',
            'timeOut'    => $row->time_out ? Carbon::parse($row->time_out)->format('h:i A') : '—',
            'status'     => $statusLabel[$row->status] ?? 'Pending',
        ])->values()->toArray();

        // ── 7. Ceremony meta ──────────────────────────────────────────────────
        $ceremonyMeta = [
            'id'     => $ceremony->flag_ceremony_id,
            'date'   => Carbon::parse($ceremony->flag_ceremony_date)->format('F d, Y'),
            'start'  => Carbon::parse($ceremony->flag_ceremony_start)->format('g:i A'),
            'end'    => Carbon::parse($ceremony->flag_ceremony_end)->format('g:i A'),
            'status' => ucfirst($ceremony->status),
        ];

        return response()->json([
            'ceremony'        => $ceremonyMeta,
            'kpis'            => $kpis,
            'timelineSlots'   => $timelineSlots,
            'statusMix'       => $statusMix,
            'departmentStats' => $departmentStats,
            'attendanceLog'   => $attendanceLog,
        ]);
    }

    private function emptyKpis(): array
    {
        return ['total' => 0, 'present' => 0, 'absent' => 0, 'excused' => 0,
                'earlyOut' => 0, 'pending' => 0, 'attendanceRate' => 0.0];
    }

    private function emptyTimeline(): array
    {
        $slots = [];
        $cur   = Carbon::today()->setTime(7, 0);
        $end   = Carbon::today()->setTime(12, 0);
        while ($cur->lt($end)) {
            $slots[] = ['time' => $cur->format('g:i A'), 'arrivals' => 0, 'cumulative' => 0];
            $cur->addMinutes(30);
        }
        return $slots;
    }

    private function emptyStatusMix(): array
    {
        return [
            ['name' => 'Present',   'value' => 0, 'color' => '#22c55e'],
            ['name' => 'Absent',    'value' => 0, 'color' => '#ef4444'],
            ['name' => 'Excused',   'value' => 0, 'color' => '#f59e0b'],
            ['name' => 'Early-out', 'value' => 0, 'color' => '#3b82f6'],
            ['name' => 'Pending',   'value' => 0, 'color' => '#9ca3af'],
        ];
    }
    public function events(): JsonResponse
{
    $ceremonies = DB::table('flag_ceremony')
        ->orderBy('flag_ceremony_date', 'desc')
        ->orderBy('created_at', 'desc')
        ->get();

    if ($ceremonies->isEmpty()) {
        return response()->json([
            'events' => [],
            'message' => 'No flag ceremonies found'
        ]);
    }

    $eventsList = [];
    foreach ($ceremonies as $ceremony) {
        // Get basic stats for each ceremony
        $stats = DB::table('flag_ceremony_record')
            ->where('flag_ceremony_id', $ceremony->flag_ceremony_id)
            ->selectRaw('
                COUNT(*) as total,
                SUM(CASE WHEN status = "present" THEN 1 ELSE 0 END) as present,
                SUM(CASE WHEN status = "absent" THEN 1 ELSE 0 END) as absent,
                SUM(CASE WHEN status = "excused" THEN 1 ELSE 0 END) as excused,
                SUM(CASE WHEN status = "early-out" THEN 1 ELSE 0 END) as early_out,
                SUM(CASE WHEN status = "pending" THEN 1 ELSE 0 END) as pending
            ')
            ->first();

        $total = $stats->total ?? 0;
        $present = $stats->present ?? 0;
        $resolved = $total - ($stats->pending ?? 0);
        $attendanceRate = $resolved > 0 ? round(($present / $resolved) * 100, 1) : 0;

        $eventsList[] = [
            'id' => $ceremony->flag_ceremony_id,
            'date' => Carbon::parse($ceremony->flag_ceremony_date)->format('F d, Y'),
            'date_raw' => $ceremony->flag_ceremony_date,
            'start' => Carbon::parse($ceremony->flag_ceremony_start)->format('g:i A'),
            'end' => Carbon::parse($ceremony->flag_ceremony_end)->format('g:i A'),
            'status' => ucfirst($ceremony->status),
            'stats' => [
                'total' => $total,
                'present' => $present,
                'absent' => $stats->absent ?? 0,
                'excused' => $stats->excused ?? 0,
                'attendance_rate' => $attendanceRate,
            ],
        ];
    }

    return response()->json([
        'events' => $eventsList,
        'total_events' => count($eventsList),
    ]);
}
}