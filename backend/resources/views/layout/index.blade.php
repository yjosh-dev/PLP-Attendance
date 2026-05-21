<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Employee Dashboard | Appeal & Attendance</title>

    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['"Inter"', 'system-ui', 'sans-serif'],
                    },
                    colors: {
                        brand: {
                            50:  '#f0fdf4',
                            100: '#dcfce7',
                            200: '#bbf7d0',
                            300: '#86efac',
                            400: '#4ade80',
                            500: '#22c55e',
                            600: '#16a34a',
                            700: '#15803d',
                            800: '#166534',
                            900: '#14532d',
                            950: '#052e16',
                        }
                    }
                }
            }
        }
    </script>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <style>
        /* ── Page background: soft green tint ── */
        body {
            background-color: #edf7ee;
            background-image:
                radial-gradient(ellipse at 10% 0%,   rgba(134,239,172,.35) 0%, transparent 50%),
                radial-gradient(ellipse at 90% 100%, rgba(21,128,61,.14)   0%, transparent 55%);
        }

        /* ── Avatar ring pulse ── */
        @keyframes ringPulse {
            0%,100% { box-shadow: 0 0 0 3px rgba(21,128,61,.18); }
            50%      { box-shadow: 0 0 0 6px rgba(21,128,61,.07); }
        }
        .avatar-ring { animation: ringPulse 3.2s ease-in-out infinite; }

        /* ── Progress bar grow ── */
        @keyframes barGrow { from { width: 0; } }
        .bar-animate { animation: barGrow .9s cubic-bezier(.4,0,.2,1) both; }

        /* ── Panel fade-up ── */
        .panel-enter { animation: panelIn .22s ease both; }
        @keyframes panelIn {
            from { opacity:0; transform:translateY(7px); }
            to   { opacity:1; transform:translateY(0); }
        }

        /* ── Card lift ── */
        .card-lift { transition: transform .18s ease, box-shadow .18s ease; }
        .card-lift:hover {
            transform: translateY(-2px);
            box-shadow: 0 22px 42px -12px rgba(21,128,61,.13);
        }

        /* ── Tab active line ── */
        .tab-active {
            color: #15803d !important;
            border-bottom: 2px solid #15803d !important;
        }

        /* ── Table row hover ── */
        .att-row { transition: background .12s; }
        .att-row:hover { background-color: #f0fdf4; }

        /* ── Scrollbar in table wrapper ── */
        .table-wrap { overflow-x: auto; }
        .table-wrap::-webkit-scrollbar { height: 4px; }
        .table-wrap::-webkit-scrollbar-thumb { background: #bbf7d0; border-radius: 9999px; }

        /* ── Modal ── */
        #responseModal { transition: opacity .2s ease, visibility .2s ease; }
        .modal-pop { animation: mPop .22s cubic-bezier(.21,1.11,.35,1.05) both; }
        @keyframes mPop {
            from { opacity:0; transform:scale(.95) translateY(8px); }
            to   { opacity:1; transform:scale(1) translateY(0); }
        }

        /* ── File drop zone ── */
        .drop-zone { transition: background .15s, border-color .15s; }
        .drop-zone.dragover { background:#f0fdf4; border-color:#15803d; }

        /* ── Divider gradient ── */
        .div-fade { background: linear-gradient(90deg,transparent,#86efac,transparent); }

        /* ── Stat card subtle glow on hover ── */
        .stat-card { transition: box-shadow .18s; }
        .stat-card:hover { box-shadow: 0 0 0 1.5px #86efac; }

        /* ── Mobile attendance card ── */
        .att-card { transition: box-shadow .15s, transform .15s; }
        .att-card:active { transform: scale(.99); }
    </style>
</head>

<body class="font-sans min-h-screen p-3 sm:p-4 lg:p-8">
<div class="max-w-screen-xl mx-auto">

    {{-- ─────────────────────────────────────────
         MAIN GRID
    ───────────────────────────────────────────── --}}
    <div class="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 lg:gap-5 items-start">

        {{-- ══════════════════════════════════════
             SIDEBAR
        ══════════════════════════════════════════ --}}
        <aside class="card-lift bg-white rounded-2xl
                      shadow-[0_8px_24px_-4px_rgba(21,128,61,.10)]
                      border border-brand-100 overflow-hidden">

            {{-- Header strip --}}
            <div class="h-20 sm:h-24 bg-gradient-to-br from-brand-800 to-brand-600 relative overflow-hidden">
                <div class="absolute inset-0 opacity-10"
                     style="background-image:radial-gradient(circle,white 1px,transparent 1px);background-size:18px 18px;"></div>
                <div class="absolute -right-6 -bottom-8 w-28 h-28 rounded-full bg-brand-500 opacity-20"></div>
                <div class="absolute -left-4 -top-6  w-20 h-20 rounded-full bg-brand-400 opacity-15"></div>
            </div>

            <div class="px-5 sm:px-6 pb-6 sm:pb-8">
                {{-- Avatar --}}
                <div class="-mt-9 sm:-mt-11 mb-3 sm:mb-4 flex justify-center">
                    @if (!empty($information->profile_image))
                        <img src="{{ Storage::url($information->profile_image) }}"
                             alt="{{ $information->first_name }}"
                             class="avatar-ring w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full object-cover
                                    border-4 border-white shadow-md">
                    @else
                        @php
                            $initials = strtoupper(
                                substr($information->first_name, 0, 1) .
                                substr($information->last_name,  0, 1)
                            );
                        @endphp
                        <div class="avatar-ring w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full
                                    bg-gradient-to-br from-brand-800 to-brand-500
                                    flex items-center justify-center
                                    text-xl sm:text-2xl font-semibold text-white
                                    border-4 border-white shadow-md select-none">
                            {{ $initials }}
                        </div>
                    @endif
                </div>

                {{-- Name & role --}}
                <div class="text-center mb-4">
                    <h2 class="text-[14px] sm:text-[15px] font-semibold text-gray-900 leading-snug">
                        {{ $information->first_name }}
                        {{ !empty($information->middle_name) ? $information->middle_name.' ' : '' }}{{ $information->last_name }}
                    </h2>
                    <p class="text-[11px] text-gray-500 mt-0.5">{{ $information->position }}</p>

                    <div class="flex items-center justify-center flex-wrap gap-2 mt-3">
                        <span class="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200
                                     text-gray-600 text-[10px] font-medium tracking-wide rounded-full px-3 py-1">
                            <svg class="w-3 h-3 text-brand-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0"/>
                            </svg>
                            {{ $information->employee_id }}
                        </span>
                        <span class="inline-flex items-center gap-1.5 bg-brand-50 border border-brand-200
                                     text-brand-700 text-[10px] font-medium rounded-full px-2.5 py-1">
                            <span class="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></span>
                            Active
                        </span>
                    </div>
                </div>

                {{-- Divider --}}
                <div class="div-fade h-px mb-4 sm:mb-5"></div>

                {{-- Detail rows --}}
                <div class="space-y-[12px] sm:space-y-[14px]">

                    @php
                        $sidebarDetails = [
                            [
                                'label' => 'Email',
                                'value' => $contact->email,
                                'break' => true,
                                'path'  => 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
                            ],
                            [
                                'label' => 'Phone',
                                'value' => $contact->phone_number,
                                'path'  => 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
                            ],
                            [
                                'label' => 'Address',
                                'value' => $contact->address,
                                'path'  => 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z',
                            ],
                            [
                                'label' => 'Department',
                                'value' => $information->department,
                                'path'  => 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
                            ],
                        ];
                    @endphp

                    @foreach ($sidebarDetails as $d)
                        <div class="flex items-start gap-3">
                            <div class="mt-0.5 w-7 h-7 rounded-lg bg-brand-50 border border-brand-100
                                        flex items-center justify-center flex-shrink-0">
                                <svg class="w-3.5 h-3.5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="{{ $d['path'] }}"/>
                                </svg>
                            </div>
                            <div class="min-w-0">
                                <p class="text-[9px] uppercase tracking-[.12em] font-semibold text-gray-400 mb-0.5">{{ $d['label'] }}</p>
                                <p class="text-[12px] font-medium text-gray-800 leading-snug {{ !empty($d['break']) ? 'break-all' : '' }}">
                                    {{ $d['value'] }}
                                </p>
                            </div>
                        </div>
                    @endforeach

                    @if (!empty($information->birthdate))
                        <div class="flex items-start gap-3">
                            <div class="mt-0.5 w-7 h-7 rounded-lg bg-brand-50 border border-brand-100
                                        flex items-center justify-center flex-shrink-0">
                                <svg class="w-3.5 h-3.5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                            </div>
                            <div>
                                <p class="text-[9px] uppercase tracking-[.12em] font-semibold text-gray-400 mb-0.5">Birthdate</p>
                                <p class="text-[12px] font-medium text-gray-800">
                                    {{ \Carbon\Carbon::parse($information->birthdate)->format('F d, Y') }}
                                </p>
                            </div>
                        </div>
                    @endif

                </div>
            </div>
        </aside>

        {{-- ══════════════════════════════════════
             RIGHT PANEL
        ══════════════════════════════════════════ --}}
        <div class="bg-white rounded-2xl
                    shadow-[0_8px_24px_-4px_rgba(21,128,61,.10)]
                    border border-brand-100 overflow-hidden flex flex-col min-h-[520px] sm:min-h-[560px]">

            {{-- ── Tab bar ── --}}
            <div class="flex items-end bg-brand-50 border-b border-brand-100 px-3 sm:px-6 gap-1" role="tablist">
                <button data-tab="attendance" role="tab" aria-selected="true"
                        class="tab-btn tab-active
                               relative py-3 sm:py-4 px-3 sm:px-5 text-[12px] sm:text-[13px] font-medium
                               border-b-2 border-transparent
                               text-gray-500 transition-colors duration-150
                               bg-transparent cursor-pointer outline-none whitespace-nowrap">
                    Attendance History
                </button>
                <button data-tab="appeal" role="tab" aria-selected="false"
                        class="tab-btn
                               relative py-3 sm:py-4 px-3 sm:px-5 text-[12px] sm:text-[13px] font-medium
                               border-b-2 border-transparent
                               text-gray-500 transition-colors duration-150
                               bg-transparent cursor-pointer outline-none whitespace-nowrap">
                    Submit Appeal
                </button>
            </div>

            {{-- ══════════════════════════════════
                 ATTENDANCE TAB
            ══════════════════════════════════════ --}}
            <div id="attendance-tab" class="tab-panel panel-enter flex flex-col gap-4 sm:gap-6 p-3 sm:p-6">

                {{-- Stat cards row --}}
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">

                    @php
                        $gradeWidth = match(true) {
                            $ratePercent >= 95 => 100,
                            $ratePercent >= 85 => 85,
                            $ratePercent >= 75 => 70,
                            $ratePercent >= 65 => 55,
                            default            => 40,
                        };

                        $totalRecords = count($history);
                        $presentCount = $history->where('status', 'present')->count();
                        $lateCount    = $history->whereIn('status', ['late', 'excused'])->count();
                        $absentCount  = $history->where('status', 'absent')->count();
                    @endphp

                    {{-- Rate --}}
                    <div class="stat-card bg-brand-50 border border-brand-100 rounded-xl p-3 sm:p-4">
                        <p class="text-[9px] uppercase tracking-[.12em] font-semibold text-brand-600 mb-1.5 sm:mb-2">Attendance Rate</p>
                        <p class="text-2xl sm:text-3xl font-bold text-brand-800 leading-none mb-0.5 sm:mb-1">
                            {{ $rate }}<span class="text-xs sm:text-sm font-medium text-brand-500">%</span>
                        </p>
                        <p class="text-[10px] text-brand-600 mb-1.5 sm:mb-2">{{ $rateSummary }}</p>
                        <div class="h-1.5 bg-brand-200 rounded-full overflow-hidden">
                            <div class="bar-animate h-full bg-brand-600 rounded-full" style="width:{{ $ratePercent }}%"></div>
                        </div>
                    </div>

                    {{-- Grade --}}
                    <div class="stat-card bg-white border border-brand-100 rounded-xl p-3 sm:p-4">
                        <p class="text-[9px] uppercase tracking-[.12em] font-semibold text-gray-400 mb-1.5 sm:mb-2">Grade</p>
                        <p class="text-2xl sm:text-3xl font-bold text-brand-700 leading-none mb-0.5 sm:mb-1">{{ $grade }}</p>
                        <p class="text-[10px] text-gray-400 mb-1.5 sm:mb-2">Overall standing</p>
                        <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div class="bar-animate h-full bg-brand-500 rounded-full" style="width:{{ $gradeWidth }}%"></div>
                        </div>
                    </div>

                    {{-- Present --}}
                    <div class="stat-card bg-white border border-brand-100 rounded-xl p-3 sm:p-4">
                        <p class="text-[9px] uppercase tracking-[.12em] font-semibold text-gray-400 mb-1.5 sm:mb-2">Present</p>
                        <p class="text-2xl sm:text-3xl font-bold text-green-600 leading-none mb-0.5 sm:mb-1">{{ $presentCount }}</p>
                        <p class="text-[10px] text-gray-400">On-time days</p>
                    </div>

                    {{-- Concerns --}}
                    <div class="stat-card bg-white border border-brand-100 rounded-xl p-3 sm:p-4">
                        <p class="text-[9px] uppercase tracking-[.12em] font-semibold text-gray-400 mb-1.5 sm:mb-2">Late / Absent</p>
                        <p class="text-2xl sm:text-3xl font-bold text-red-500 leading-none mb-0.5 sm:mb-1">{{ $lateCount + $absentCount }}</p>
                        <p class="text-[10px] text-gray-400">Needs attention</p>
                    </div>

                </div>

                {{-- Section label --}}
                <div class="flex items-center justify-between">
                    <p class="text-[11px] sm:text-[12px] font-semibold text-gray-500 uppercase tracking-[.09em]">Attendance Records</p>
                    <span class="text-[11px] text-brand-600 font-medium bg-brand-50 border border-brand-100
                                 rounded-full px-2.5 py-0.5">
                        {{ $totalRecords }} {{ Str::plural('record', $totalRecords) }}
                    </span>
                </div>

                {{-- ── DESKTOP TABLE (hidden on mobile) ── --}}
                <div class="table-wrap rounded-xl border border-brand-100 overflow-hidden hidden sm:block">
                    <table class="w-full text-[13px] border-collapse min-w-[480px]">
                        <thead>
                            <tr class="bg-brand-50">
                                <th class="text-left px-4 py-3 text-[10px] uppercase tracking-[.1em] font-semibold text-brand-700 border-b border-brand-100">Date</th>
                                <th class="text-left px-4 py-3 text-[10px] uppercase tracking-[.1em] font-semibold text-brand-700 border-b border-brand-100">Time In</th>
                                <th class="text-left px-4 py-3 text-[10px] uppercase tracking-[.1em] font-semibold text-brand-700 border-b border-brand-100">Time Out</th>
                                <th class="text-left px-4 py-3 text-[10px] uppercase tracking-[.1em] font-semibold text-brand-700 border-b border-brand-100">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($history as $record)
                                @php
                                    $status = strtolower(trim($record->status ?? ''));
                                    $badges = [
                                        'present' => 'bg-green-50 text-green-700 border border-green-200',
                                        'late'    => 'bg-amber-50 text-amber-700 border border-amber-200',
                                        'excused' => 'bg-sky-50   text-sky-700   border border-sky-200',
                                        'absent'  => 'bg-red-50   text-red-600   border border-red-200',
                                        'pending' => 'bg-amber-50 text-amber-700 border border-amber-200',
                                        'in' => 'bg-blue-50 text-blue-700 border border-blue-200',
                                    ];
                                    $labels = [
                                        'present' => 'Present',
                                        'late'    => 'Late',
                                        'excused' => 'Excused',
                                        'absent'  => 'Absent',
                                        'pending' => 'Pending',
                                        'in' => 'In',
                                    ];
                                    $badge = $badges[$status] ?? 'bg-red-50 text-red-600 border border-red-200';
                                    $label = $labels[$status] ?? 'Absent';
                                    $dotColors = [
                                        'present' => 'bg-green-400',
                                        'late'    => 'bg-amber-400',
                                        'excused' => 'bg-sky-400',
                                        'absent'  => 'bg-red-400',
                                        'pending' => 'bg-amber-400',
                                    ];
                                    $dot = $dotColors[$status] ?? 'bg-red-400';
                                @endphp
                                <tr class="att-row border-b border-gray-50">
                                    <td class="px-4 py-3 font-medium text-gray-800">
                                        {{ !empty($record->flag_ceremony_date)
                                            ? \Carbon\Carbon::parse($record->flag_ceremony_date)->format('M d, Y')
                                            : '—' }}
                                    </td>
                                    <td class="px-4 py-3 text-gray-500 font-mono text-[12px]">
                                        {{ !empty($record->time_in)
                                            ? \Carbon\Carbon::parse($record->time_in)->format('h:i A')
                                            : '— —' }}
                                    </td>
                                    <td class="px-4 py-3 text-gray-500 font-mono text-[12px]">
                                        {{ !empty($record->time_out)
                                            ? \Carbon\Carbon::parse($record->time_out)->format('h:i A')
                                            : '— —' }}
                                    </td>
                                    <td class="px-4 py-3">
                                        <span class="inline-flex items-center gap-1.5 text-[11px] font-semibold
                                                     rounded-full px-2.5 py-1 {{ $badge }}">
                                            <span class="w-1.5 h-1.5 rounded-full {{ $dot }}"></span>
                                            {{ $label }}
                                        </span>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="4" class="text-center py-14">
                                        <div class="flex flex-col items-center gap-2">
                                            <svg class="w-8 h-8 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                                            </svg>
                                            <p class="text-[13px] text-gray-400">No attendance records found.</p>
                                        </div>
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>

                {{-- ── MOBILE CARD LIST (hidden on sm+) ── --}}
                <div class="sm:hidden flex flex-col gap-2.5">
                    @forelse ($history as $record)
                        @php
                            $status = strtolower(trim($record->status ?? ''));
                            $badges = [
                                'present' => 'bg-green-50 text-green-700 border border-green-200',
                                'late'    => 'bg-amber-50 text-amber-700 border border-amber-200',
                                'excused' => 'bg-sky-50   text-sky-700   border border-sky-200',
                                'absent'  => 'bg-red-50   text-red-600   border border-red-200',
                                'pending' => 'bg-amber-50 text-amber-700 border border-amber-200',
                            ];
                            $labels = [
                                'present' => 'Present',
                                'late'    => 'Late',
                                'excused' => 'Excused',
                                'absent'  => 'Absent',
                                'pending' => 'Pending',
                            ];
                            $badge = $badges[$status] ?? 'bg-red-50 text-red-600 border border-red-200';
                            $label = $labels[$status] ?? 'Absent';
                            $dotColors = [
                                'present' => 'bg-green-400',
                                'late'    => 'bg-amber-400',
                                'excused' => 'bg-sky-400',
                                'absent'  => 'bg-red-400',
                                'pending' => 'bg-amber-400',
                            ];
                            $dot = $dotColors[$status] ?? 'bg-red-400';
                        @endphp

                        <div class="att-card rounded-xl border border-brand-100 bg-brand-50/40 p-3.5 flex flex-col gap-2.5">

                            {{-- Date + Status --}}
                            <div class="flex items-center justify-between gap-2">
                                <p class="text-[13px] font-semibold text-gray-800">
                                    {{ !empty($record->flag_ceremony_date)
                                        ? \Carbon\Carbon::parse($record->flag_ceremony_date)->format('M d, Y')
                                        : '—' }}
                                </p>
                                <span class="inline-flex items-center gap-1.5 text-[11px] font-semibold rounded-full px-2.5 py-1 flex-shrink-0 {{ $badge }}">
                                    <span class="w-1.5 h-1.5 rounded-full {{ $dot }}"></span>
                                    {{ $label }}
                                </span>
                            </div>

                            {{-- Divider --}}
                            <div class="h-px bg-brand-100"></div>

                            {{-- Time In / Time Out --}}
                            <div class="flex items-center gap-3 text-[12px]">
                                {{-- Time In --}}
                                <div class="flex items-center gap-1.5 flex-1">
                                    <div class="w-6 h-6 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0">
                                        <svg class="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <p class="text-[9px] uppercase tracking-[.1em] font-semibold text-gray-400 leading-none mb-0.5">Time In</p>
                                        <p class="font-mono text-gray-700 font-medium">
                                            {{ !empty($record->time_in)
                                                ? \Carbon\Carbon::parse($record->time_in)->format('h:i A')
                                                : '— —' }}
                                        </p>
                                    </div>
                                </div>

                                {{-- Separator --}}
                                <div class="w-px h-8 bg-gray-200 flex-shrink-0"></div>

                                {{-- Time Out --}}
                                <div class="flex items-center gap-1.5 flex-1">
                                    <div class="w-6 h-6 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
                                        <svg class="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <p class="text-[9px] uppercase tracking-[.1em] font-semibold text-gray-400 leading-none mb-0.5">Time Out</p>
                                        <p class="font-mono text-gray-700 font-medium">
                                            {{ !empty($record->time_out)
                                                ? \Carbon\Carbon::parse($record->time_out)->format('h:i A')
                                                : '— —' }}
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>

                    @empty
                        <div class="flex flex-col items-center gap-2 py-12">
                            <svg class="w-8 h-8 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                            </svg>
                            <p class="text-[13px] text-gray-400">No attendance records found.</p>
                        </div>
                    @endforelse
                </div>

            </div>

            {{-- ══════════════════════════════════
                 APPEAL TAB
            ══════════════════════════════════════ --}}
            <div id="appeal-tab" class="tab-panel hidden p-4 sm:p-6">
                <div class="max-w-2xl mx-auto">

                    {{-- Header --}}
                    <div class="mb-5 sm:mb-6">
                        <h3 class="text-[14px] sm:text-[15px] font-semibold text-gray-900">Attendance Correction Request</h3>
                        <p class="text-[12px] text-gray-500 mt-1">
                            Fill in the details below. HR will review within 2–3 business days.
                        </p>
                    </div>

                    {{-- Form --}}
                    <form id="appealForm" method="POST" enctype="multipart/form-data" class="space-y-4" novalidate>
                        @csrf
                        <input type="hidden" name="employee_id" value="{{ $information->employee_id }}">

                        {{-- Row 1: Date + Type --}}
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label for="appealDate" class="block text-[11px] font-semibold uppercase tracking-[.1em] text-gray-500 mb-1.5">
                                    Date to Correct
                                </label>
                                <input type="date" name="date_excused" id="appealDate" required
                                       class="w-full rounded-xl border border-gray-200 bg-gray-50
                                              px-4 py-2.5 text-[13px] text-gray-800
                                              focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent
                                              transition">
                            </div>
                            <div>
                                <label for="appealType" class="block text-[11px] font-semibold uppercase tracking-[.1em] text-gray-500 mb-1.5">
                                    Type of Concern
                                </label>
                                <select name="type" id="appealType" required
                                        class="w-full rounded-xl border border-gray-200 bg-gray-50
                                               px-4 py-2.5 text-[13px] text-gray-800
                                               focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent
                                               transition appearance-none">
                                    <option value="">Select type…</option>
                                    <option value="marked_absent">Marked Absent</option>
                                    <option value="marked_late">Marked Late</option>
                                    <option value="wrong_time">Wrong Time In / Out</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        {{-- Reason --}}
                        <div>
                            <label for="appealReason" class="block text-[11px] font-semibold uppercase tracking-[.1em] text-gray-500 mb-1.5">
                                Reason
                            </label>
                            <input type="text" name="reason" id="appealReason" maxlength="255" required
                                   placeholder="Brief description of your concern"
                                   class="w-full rounded-xl border border-gray-200 bg-gray-50
                                          px-4 py-2.5 text-[13px] text-gray-800
                                          focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent
                                          transition">
                        </div>

                        {{-- Notes --}}
                        <div>
                            <label for="appealNote" class="block text-[11px] font-semibold uppercase tracking-[.1em] text-gray-500 mb-1.5">
                                Additional Notes
                            </label>
                            <textarea name="note" id="appealNote" rows="3" required
                                      placeholder="Provide more context or any supporting details…"
                                      class="w-full rounded-xl border border-gray-200 bg-gray-50
                                             px-4 py-2.5 text-[13px] text-gray-800 resize-none
                                             focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent
                                             transition"></textarea>
                        </div>

                        {{-- File drop zone --}}
                        <div>
                            <label class="block text-[11px] font-semibold uppercase tracking-[.1em] text-gray-500 mb-1.5">
                                Proof Document
                            </label>
                            <div id="dropZone"
                                 class="drop-zone rounded-xl border-2 border-dashed border-brand-200
                                        bg-brand-50 px-4 py-6 sm:py-8 text-center cursor-pointer">
                                <svg class="w-7 h-7 text-brand-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                                </svg>
                                <p class="text-[12px] text-gray-500">
                                    Drag a file here or
                                    <span id="browseLink" class="text-brand-600 font-medium cursor-pointer hover:underline">browse</span>
                                </p>
                                <p class="text-[10px] text-gray-400 mt-1">JPEG, PNG, PDF — max 5 MB</p>
                                <p id="fileNameDisplay" class="text-[11px] text-brand-600 font-medium mt-2 hidden"></p>
                            </div>
                            <input type="file" name="proof_image" id="appealImage" accept="image/*,.pdf" class="hidden" required>
                        </div>

                        {{-- Info notice --}}
                        <div class="flex items-start gap-2.5 bg-brand-50 border border-brand-100 rounded-xl px-4 py-3">
                            <svg class="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <p class="text-[11px] text-brand-700 leading-relaxed">
                                All appeals are logged and reviewed by the HR team. You will receive an email notification once a decision is made.
                            </p>
                        </div>

                        {{-- Submit --}}
                        <button type="submit" id="submitAppealBtn"
                                class="w-full bg-brand-700 hover:bg-brand-800
                                       text-white text-[13px] font-semibold
                                       py-3 rounded-xl shadow-sm
                                       transition duration-150
                                       flex items-center justify-center gap-2">
                            Submit Appeal
                        </button>
                    </form>

                </div>
            </div>

        </div>
        {{-- end right panel --}}

    </div>
    {{-- end grid --}}

</div>
{{-- end container --}}


{{-- ══════════════════════════════════════════════════
     RESPONSE MODAL
══════════════════════════════════════════════════ --}}
<div id="responseModal"
     class="fixed inset-0 z-50 flex items-center justify-center p-4
            opacity-0 invisible pointer-events-none"
     style="background-color:rgba(0,0,0,.38);backdrop-filter:blur(4px);"
     role="dialog" aria-modal="true" aria-labelledby="modalTitle">

    <div class="modal-pop bg-white rounded-2xl max-w-sm w-full
                shadow-[0_24px_48px_-8px_rgba(0,0,0,.2)]
                border border-gray-100 overflow-hidden">

        <div id="modalStripe" class="h-1.5 w-full bg-brand-500"></div>

        <div class="p-6 sm:p-7 text-center">
            <div id="modalIcon"
                 class="mx-auto mb-4 w-14 h-14 rounded-full
                        flex items-center justify-center bg-brand-50">
            </div>

            <h3 id="modalTitle" class="text-[15px] sm:text-[16px] font-semibold text-gray-900 mb-1.5">Title</h3>
            <p  id="modalMessage" class="text-[12px] sm:text-[13px] text-gray-500 leading-relaxed mb-6">Message</p>

            <button id="closeModalBtn"
                    class="px-6 py-2.5 bg-brand-700 hover:bg-brand-800
                           text-white text-[13px] font-semibold rounded-xl
                           transition shadow-sm">
                Dismiss
            </button>
        </div>
    </div>
</div>


<script>
document.addEventListener('DOMContentLoaded', function () {

    // ─── TABS ───────────────────────────────────────
    const tabBtns   = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    function switchTab(id) {
        tabPanels.forEach(p => {
            p.classList.add('hidden');
            p.classList.remove('panel-enter');
        });
        tabBtns.forEach(b => {
            b.classList.remove('tab-active');
            b.setAttribute('aria-selected', 'false');
        });

        const panel = document.getElementById(id + '-tab');
        const btn   = document.querySelector(`[data-tab="${id}"]`);

        if (panel) {
            panel.classList.remove('hidden');
            void panel.offsetWidth;
            panel.classList.add('panel-enter');
        }
        if (btn) {
            btn.classList.add('tab-active');
            btn.setAttribute('aria-selected', 'true');
        }
    }

    tabBtns.forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));
    switchTab('attendance');

    // ─── FILE DROP ZONE ─────────────────────────────
    const dropZone        = document.getElementById('dropZone');
    const fileInput       = document.getElementById('appealImage');
    const browseLink      = document.getElementById('browseLink');
    const fileNameDisplay = document.getElementById('fileNameDisplay');

    function setFileName(file) {
        if (!file) return;
        fileNameDisplay.textContent = `📎 ${file.name} (${(file.size / 1024).toFixed(0)} KB)`;
        fileNameDisplay.classList.remove('hidden');
    }

    browseLink.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('click',   () => fileInput.click());
    fileInput.addEventListener('change', () => setFileName(fileInput.files[0]));

    dropZone.addEventListener('dragover',  e => { e.preventDefault(); dropZone.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', e => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const f = e.dataTransfer.files[0];
        if (f) {
            const dt = new DataTransfer();
            dt.items.add(f);
            fileInput.files = dt.files;
            setFileName(f);
        }
    });

    // ─── MODAL ──────────────────────────────────────
    const modal       = document.getElementById('responseModal');
    const modalStripe = document.getElementById('modalStripe');
    const modalIcon   = document.getElementById('modalIcon');
    const modalTitle  = document.getElementById('modalTitle');
    const modalMsg    = document.getElementById('modalMessage');

    const modalConfig = {
        success: {
            stripe: '#15803d',
            iconBg: '#f0fdf4',
            iconColor: '#15803d',
            svgPath: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>',
        },
        error: {
            stripe: '#dc2626',
            iconBg: '#fef2f2',
            iconColor: '#dc2626',
            svgPath: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>',
        },
        warning: {
            stripe: '#d97706',
            iconBg: '#fffbeb',
            iconColor: '#d97706',
            svgPath: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>',
        },
    };

    function showModal(type, title, message) {
        const cfg = modalConfig[type] || modalConfig.error;
        modalStripe.style.background = cfg.stripe;
        modalIcon.style.background   = cfg.iconBg;
        modalIcon.innerHTML = `
            <svg class="w-7 h-7" style="color:${cfg.iconColor}" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                ${cfg.svgPath}
            </svg>`;
        modalTitle.textContent = title;
        modalMsg.textContent   = message;
        modal.classList.remove('opacity-0', 'invisible', 'pointer-events-none');
        modal.classList.add('opacity-100', 'visible');
        modal.style.pointerEvents = 'auto';
    }

    function closeModal() {
        modal.classList.add('opacity-0', 'invisible', 'pointer-events-none');
        modal.classList.remove('opacity-100', 'visible');
        modal.style.pointerEvents = 'none';
    }

    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

    // ─── APPEAL FORM SUBMIT ──────────────────────────
    const appealForm      = document.getElementById('appealForm');
    const submitBtn       = document.getElementById('submitAppealBtn');
    const originalBtnHTML = submitBtn.innerHTML;

    appealForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const date   = document.getElementById('appealDate').value;
        const type   = document.getElementById('appealType').value;
        const reason = document.getElementById('appealReason').value.trim();
        const note   = document.getElementById('appealNote').value.trim();
        const file   = fileInput.files[0];

        if (!date)   return showModal('warning', 'Date Required',   'Please select the date you want corrected.');
        if (!type)   return showModal('warning', 'Type Required',   'Please choose the type of concern.');
        if (!reason) return showModal('warning', 'Reason Required', 'Please provide a brief reason for your appeal.');
        if (!note)   return showModal('warning', 'Notes Required',  'Please fill in the additional notes field.');
        if (!file)   return showModal('warning', 'Proof Required',  'Please upload a proof document (image or PDF).');

        submitBtn.disabled  = true;
        submitBtn.innerHTML = `
            <svg class="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Submitting…`;
        submitBtn.classList.add('opacity-70', 'cursor-not-allowed');

        try {
            const formData = new FormData(appealForm);

            const response = await fetch('{{ url("/save_appeal") }}', {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
                body: formData,
            });

            let result;
            try {
                result = await response.json();
            } catch {
                result = { success: false, message: 'Unexpected server response. Please try again.' };
            }

            if (response.ok && result.success === true) {
                showModal('success', 'Appeal Submitted', result.message || 'Your request has been logged. HR will review and respond shortly.');
                appealForm.reset();
                fileNameDisplay.textContent = '';
                fileNameDisplay.classList.add('hidden');
            } else {
                showModal('error', 'Submission Failed', result.message || 'Something went wrong. Please verify your details and try again.');
            }

        } catch (err) {
            console.error('Network error:', err);
            showModal('error', 'Connection Error', 'Unable to reach the server. Please check your internet connection and try again.');
        } finally {
            submitBtn.disabled  = false;
            submitBtn.innerHTML = originalBtnHTML;
            submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
        }
    });

});
</script>

</body>
</html>