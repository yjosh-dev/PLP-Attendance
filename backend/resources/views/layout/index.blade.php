<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>Employee Dashboard | Appeal & Attendance</title>

    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        forest: {
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
                        }
                    },
                    fontFamily: {
                        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
                    },
                }
            }
        }
    </script>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap" rel="stylesheet">

    <style>
        body {
            background-color: #e8f5e9;
            background-image:
                radial-gradient(ellipse at 20% 10%, rgba(74,222,128,.25) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 80%, rgba(22,163,74,.18) 0%, transparent 50%);
        }
        .divider-gradient {
            background: linear-gradient(90deg, transparent, #4ade80, #15803d, #4ade80, transparent);
        }
        .tab-active::after {
            content: '';
            position: absolute;
            bottom: -2px; left: 0; right: 0;
            height: 3px;
            background: #15803d;
            border-radius: 3px 3px 0 0;
        }
        .bar-fill {
            transition: width .6s cubic-bezier(.4,0,.2,1);
        }
        .tab-panel {
            animation: fadeUp .3s ease both;
        }
        @keyframes fadeUp {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
        }

        /* Modal animation and backdrop */
        .modal-backdrop {
            animation: fadeInBackdrop 0.2s ease forwards;
        }
        .modal-content {
            animation: modalPop 0.25s cubic-bezier(0.21, 1.11, 0.35, 1.05) forwards;
        }
        @keyframes fadeInBackdrop {
            from { opacity: 0; backdrop-filter: blur(0px); }
            to { opacity: 1; backdrop-filter: blur(4px); }
        }
        @keyframes modalPop {
            from { opacity: 0; transform: scale(0.96) translateY(10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .btn-submit-loading {
            transition: all 0.2s;
        }
    </style>
</head>

<body class="font-sans min-h-screen p-5 lg:p-7">
<div class="max-w-screen-xl mx-auto">

    {{-- ── Main Grid ── --}}
    <div class="grid grid-cols-1 lg:grid-cols-[30%_1fr] gap-6">

        {{-- ══════════════════════════════
             LEFT — Employee Info
             ══════════════════════════════ --}}
        <div class="bg-white rounded-3xl shadow-[0_20px_35px_-10px_rgba(0,0,0,.1)]
                    overflow-hidden h-fit
                    hover:-translate-y-0.5 hover:shadow-[0_25px_40px_-12px_rgba(0,0,0,.15)]
                    transition-all duration-200">
            <div class="p-8">

                {{-- Avatar --}}
                <div class="flex justify-center mb-5">
                    @if (!empty($information->profile_image))
                        <img src="{{ Storage::url($information->profile_image) }}"
                             alt="{{ $information->first_name }}"
                             class="w-28 h-28 rounded-full object-cover
                                    border-4 border-forest-700
                                    shadow-[0_8px_20px_rgba(21,128,61,.2)]">
                    @else
                        @php
                            $initials = strtoupper(
                                substr($information->first_name, 0, 1) .
                                substr($information->last_name,  0, 1)
                            );
                        @endphp
                        <div class="w-28 h-28 rounded-full
                                    bg-gradient-to-br from-forest-700 to-forest-500
                                    flex items-center justify-center
                                    text-5xl font-bold text-white
                                    border-4 border-white
                                    shadow-[0_8px_20px_rgba(21,128,61,.2)]">
                            {{ $initials }}
                        </div>
                    @endif
                </div>

                {{-- Name --}}
                <h2 class="text-center text-xl font-bold text-forest-900 mb-2 leading-tight">
                    {{ $information->first_name }}
                    {{ !empty($information->middle_name) ? $information->middle_name . ' ' : '' }}{{ $information->last_name }}
                </h2>

                {{-- ID Badge --}}
                <div class="flex justify-center mb-5">
                    <span class="bg-forest-50 text-forest-700 text-xs font-semibold
                                 tracking-wider px-4 py-1.5 rounded-full">
                        ID: {{ $information->employee_id }}
                    </span>
                </div>

                {{-- Divider --}}
                <div class="divider-gradient h-px my-5 rounded-full"></div>

                {{-- Details --}}
                <div class="flex flex-col gap-5">

                    <div>
                        <p class="text-[0.65rem] uppercase tracking-widest font-semibold text-gray-400 mb-0.5">Email Address</p>
                        <p class="text-sm font-medium text-forest-900 break-all">{{ $contact->email }}</p>
                    </div>

                    <div>
                        <p class="text-[0.65rem] uppercase tracking-widest font-semibold text-gray-400 mb-0.5">Phone Number</p>
                        <p class="text-sm font-medium text-forest-900">{{ $contact->phone_number }}</p>
                    </div>

                    <div>
                        <p class="text-[0.65rem] uppercase tracking-widest font-semibold text-gray-400 mb-0.5">Address</p>
                        <p class="text-sm font-medium text-forest-900">{{ $contact->address }}</p>
                    </div>

                    <div>
                        <p class="text-[0.65rem] uppercase tracking-widest font-semibold text-gray-400 mb-0.5">Department</p>
                        <p class="text-sm font-medium text-forest-900">{{ $information->department }}</p>
                    </div>

                    <div>
                        <p class="text-[0.65rem] uppercase tracking-widest font-semibold text-gray-400 mb-0.5">Position</p>
                        <p class="text-sm font-medium text-forest-900">{{ $information->position }}</p>
                    </div>

                    @if (!empty($information->birthdate))
                    <div>
                        <p class="text-[0.65rem] uppercase tracking-widest font-semibold text-gray-400 mb-0.5">Birthdate</p>
                        <p class="text-sm font-medium text-forest-900">
                            {{ \Carbon\Carbon::parse($information->birthdate)->format('F d, Y') }}
                        </p>
                    </div>
                    @endif

                </div>
            </div>
        </div>

        {{-- ══════════════════════════════
             RIGHT — Tabs
             ══════════════════════════════ --}}
        <div class="bg-white rounded-3xl shadow-[0_20px_35px_-10px_rgba(0,0,0,.1)]
                    overflow-hidden flex flex-col min-h-[500px]">

            {{-- Tab Buttons --}}
            <div class="flex bg-forest-50 border-b-2 border-forest-100 px-6">
                <button data-tab="attendance"
                        class="tab-btn relative py-5 px-7 text-sm font-semibold tracking-wide
                               transition-colors duration-200 bg-transparent border-none cursor-pointer">
                    Attendance History
                </button>
                <button data-tab="appeal"
                        class="tab-btn relative py-5 px-7 text-sm font-semibold tracking-wide
                               transition-colors duration-200 bg-transparent border-none cursor-pointer">
                    Appeal
                </button>
            </div>

            {{-- ── ATTENDANCE TAB ── --}}
            <div id="attendance-tab" class="tab-panel p-7">

                <div class="overflow-x-auto mb-8 rounded-2xl border border-forest-100">
                    <table class="w-full text-sm border-collapse">
                        <thead>
                            <tr class="bg-forest-50">
                                <th class="text-left px-4 py-3.5 text-forest-800 font-semibold
                                           border-b-2 border-forest-100 text-xs uppercase tracking-wide">Date</th>
                                <th class="text-left px-4 py-3.5 text-forest-800 font-semibold
                                           border-b-2 border-forest-100 text-xs uppercase tracking-wide">Time In</th>
                                <th class="text-left px-4 py-3.5 text-forest-800 font-semibold
                                           border-b-2 border-forest-100 text-xs uppercase tracking-wide">Time Out</th>
                                <th class="text-left px-4 py-3.5 text-forest-800 font-semibold
                                           border-b-2 border-forest-100 text-xs uppercase tracking-wide">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($history as $record)
                                <tr class="hover:bg-forest-50 transition-colors duration-150">
                                    <td class="px-4 py-3 border-b border-forest-50 text-gray-700 font-medium">
                                        {{ !empty($record->created_at)
                                            ? \Carbon\Carbon::parse($record->created_at)->format('M d, Y')
                                            : '—' }}
                                    </td>
                                    <td class="px-4 py-3 border-b border-forest-50 text-gray-600">
                                        {{ !empty($record->time_in)
                                            ? \Carbon\Carbon::parse($record->time_in)->format('h:i A')
                                            : '--:--' }}
                                    </td>
                                    <td class="px-4 py-3 border-b border-forest-50 text-gray-600">
                                        {{ !empty($record->time_out)
                                            ? \Carbon\Carbon::parse($record->time_out)->format('h:i A')
                                            : '--:--' }}
                                    </td>
                                    <td class="px-4 py-3 border-b border-forest-50">
                                        @php
                                            $status = strtolower($record->status ?? 'absent');
                                            $badge  = match($status) {
                                                'present'            => 'bg-forest-100 text-forest-700',
                                                'late'               => 'bg-amber-100 text-amber-700',
                                                'onduty', 'on duty'  => 'bg-blue-100 text-blue-700',
                                                default              => 'bg-red-100 text-red-700',
                                            };
                                            $label  = match($status) {
                                                'present'            => 'Present',
                                                'late'               => 'Late',
                                                'onduty', 'on duty'  => 'On Duty',
                                                default              => 'Absent',
                                            };
                                        @endphp
                                        <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold {{ $badge }}">
                                            {{ $label }}
                                        </span>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="4" class="text-center text-gray-400 py-12 text-sm">
                                        No attendance records found.
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>

                {{-- Grade & Rate --}}
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    <div class="bg-gradient-to-br from-forest-50 to-forest-100 rounded-2xl p-6 text-center">
                        <p class="text-[0.65rem] uppercase tracking-[.15em] font-semibold text-forest-600 mb-3">
                            Attendance Grade
                        </p>
                        <p class="text-6xl font-extrabold text-forest-700 mb-3 leading-none">
                            {{ $grade }}
                        </p>
                        <div class="bg-forest-200 rounded-full h-2 overflow-hidden mt-3">
                            <div class="bar-fill bg-gradient-to-r from-forest-500 to-forest-700 h-full rounded-full"
                                 style="width: {{ $ratePercent }}%"></div>
                        </div>
                    </div>

                    <div class="bg-gradient-to-br from-forest-50 to-forest-100 rounded-2xl p-6 text-center">
                        <p class="text-[0.65rem] uppercase tracking-[.15em] font-semibold text-forest-600 mb-3">
                            Attendance Rate
                        </p>
                        <p class="text-5xl font-extrabold text-forest-700 mb-2 leading-none">
                            {{ $rate }}%
                        </p>
                        <p class="text-xs text-forest-500 mt-2">{{ $rateSummary }}</p>
                    </div>

                </div>
            </div>

            {{-- ── APPEAL TAB (with AJAX + Modal Response) ── --}}
            <div id="appeal-tab" class="tab-panel p-7 hidden">

                <div class="max-w-3xl mx-auto">
                    <div class="mb-6">
                        <h3 class="text-xl font-bold text-forest-900">Submit Attendance Appeal</h3>
                        <p class="text-sm text-gray-500 mt-1">
                            Request correction for absent, late, or attendance concerns.
                        </p>
                    </div>

                    {{-- Appeal Form — will be submitted via fetch to show modal response --}}
                    <form id="appealForm" method="POST" enctype="multipart/form-data" class="space-y-5">
                        @csrf
                        <input type="hidden" name="employee_id" value="{{ $information->employee_id }}">

                        <div>
                            <label class="block text-sm font-semibold text-forest-800 mb-2">Date Excused</label>
                            <input type="date" name="date_excused" required
                                   class="w-full rounded-2xl border border-forest-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-forest-500" id="appealDate">
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-forest-800 mb-2">Reason</label>
                            <input type="text" name="reason" maxlength="255" required placeholder="Enter reason"
                                   class="w-full rounded-2xl border border-forest-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-forest-500" id="appealReason">
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-forest-800 mb-2">Additional Note</label>
                            <textarea name="note" rows="4" required placeholder="Provide more details..."
                                      class="w-full rounded-2xl border border-forest-200 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-forest-500" id="appealNote"></textarea>
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-forest-800 mb-2">Proof Image</label>
                            <input type="file" name="proof_image" accept="image/*" required
                                   class="w-full rounded-2xl border border-forest-200 px-4 py-3 file:mr-4 file:px-4 file:py-2 file:rounded-xl file:border-0 file:bg-forest-600 file:text-white hover:file:bg-forest-700" id="appealImage">
                        </div>

                        <div class="pt-2">
                            <button type="submit" id="submitAppealBtn"
                                    class="w-full bg-gradient-to-r from-forest-700 to-forest-600 hover:from-forest-800 hover:to-forest-700 text-white font-semibold py-3 rounded-2xl shadow-lg transition duration-200">
                                Submit Appeal
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
        {{-- end right card --}}

    </div>
    {{-- end grid --}}

</div>

{{-- ==========================================================
     RESPONSE MODAL (custom success/error popup)
     ========================================================== --}}
<div id="responseModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 opacity-0 invisible transition-all duration-200 pointer-events-none" style="background-color: rgba(0,0,0,0.4); backdrop-filter: blur(4px);">
    <div class="modal-content bg-white rounded-3xl max-w-md w-full shadow-2xl transform overflow-hidden">
        <div class="relative p-6 text-center">
            {{-- Dynamic icon based on status --}}
            <div id="modalIcon" class="mx-auto flex items-center justify-center h-14 w-14 rounded-full mb-4">
                <!-- dynamic content via js -->
            </div>
            <h3 id="modalTitle" class="text-xl font-bold text-forest-900 mb-2">Success</h3>
            <p id="modalMessage" class="text-gray-600 text-sm mb-6">Your appeal has been submitted successfully.</p>
            <button id="closeModalBtn" class="px-6 py-2.5 bg-forest-700 hover:bg-forest-800 text-white font-semibold rounded-xl transition shadow-md">
                Dismiss
            </button>
        </div>
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function () {
        // ----- TABS LOGIC -----
        const buttons = document.querySelectorAll('.tab-btn');
        function switchTab(id) {
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
            buttons.forEach(b => {
                b.classList.remove('text-forest-800', 'tab-active');
                b.classList.add('text-gray-500');
            });
            const panel = document.getElementById(id + '-tab');
            if (panel) panel.classList.remove('hidden');
            const btn = document.querySelector(`[data-tab="${id}"]`);
            if (btn) {
                btn.classList.remove('text-gray-500');
                btn.classList.add('text-forest-800', 'tab-active');
            }
        }
        buttons.forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));
        switchTab('attendance');

        // ----- MODAL CONTROLLER -----
        const modal = document.getElementById('responseModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalMessage = document.getElementById('modalMessage');
        const modalIcon = document.getElementById('modalIcon');
        const closeModalBtn = document.getElementById('closeModalBtn');

        function showModal(type, title, message) {
            // Reset icon styling
            modalIcon.innerHTML = '';
            if (type === 'success') {
                modalIcon.classList.add('bg-green-100');
                const svgSuccess = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svgSuccess.setAttribute('class', 'h-7 w-7 text-green-600');
                svgSuccess.setAttribute('fill', 'none');
                svgSuccess.setAttribute('viewBox', '0 0 24 24');
                svgSuccess.setAttribute('stroke', 'currentColor');
                svgSuccess.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />';
                modalIcon.appendChild(svgSuccess);
                modalIcon.classList.remove('bg-red-100', 'bg-amber-100');
                modalIcon.classList.add('bg-green-100');
            } else if (type === 'error') {
                modalIcon.classList.add('bg-red-100');
                const svgError = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svgError.setAttribute('class', 'h-7 w-7 text-red-600');
                svgError.setAttribute('fill', 'none');
                svgError.setAttribute('viewBox', '0 0 24 24');
                svgError.setAttribute('stroke', 'currentColor');
                svgError.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />';
                modalIcon.appendChild(svgError);
                modalIcon.classList.remove('bg-green-100', 'bg-amber-100');
                modalIcon.classList.add('bg-red-100');
            } else if (type === 'warning') {
                modalIcon.classList.add('bg-amber-100');
                const svgWarning = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svgWarning.setAttribute('class', 'h-7 w-7 text-amber-600');
                svgWarning.setAttribute('fill', 'none');
                svgWarning.setAttribute('viewBox', '0 0 24 24');
                svgWarning.setAttribute('stroke', 'currentColor');
                svgWarning.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />';
                modalIcon.appendChild(svgWarning);
                modalIcon.classList.remove('bg-green-100', 'bg-red-100');
                modalIcon.classList.add('bg-amber-100');
            }
            modalTitle.innerText = title;
            modalMessage.innerText = message;
            // make modal visible
            modal.classList.remove('invisible', 'pointer-events-none');
            modal.classList.add('opacity-100', 'visible');
            modal.style.pointerEvents = 'auto';
        }

        function closeModal() {
            modal.classList.add('invisible', 'pointer-events-none');
            modal.classList.remove('opacity-100', 'visible');
            modal.style.pointerEvents = 'none';
        }

        closeModalBtn.addEventListener('click', closeModal);
        // clicking backdrop closes too
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal();
        });

        // ----- HANDLE APPEAL FORM SUBMIT VIA FETCH (with Modal Response) -----
        const appealForm = document.getElementById('appealForm');
        const submitBtn = document.getElementById('submitAppealBtn');
        // store initial button text
        const originalBtnText = submitBtn.innerHTML;

        appealForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Basic client-side validation for required fields
            const dateExcused = document.querySelector('input[name="date_excused"]').value;
            const reason = document.querySelector('input[name="reason"]').value.trim();
            const note = document.querySelector('textarea[name="note"]').value.trim();
            const proofFile = document.querySelector('input[name="proof_image"]').files[0];

            if (!dateExcused) {
                showModal('warning', 'Missing Field', 'Please select the date excused.');
                return;
            }
            if (!reason) {
                showModal('warning', 'Missing Reason', 'Please enter a reason for your appeal.');
                return;
            }
            if (!note) {
                showModal('warning', 'Missing Note', 'Please provide additional details.');
                return;
            }
            if (!proofFile) {
                showModal('warning', 'Proof Required', 'Please upload a proof image (medical certificate, memo, etc.).');
                return;
            }

            // Show loading state on button
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
            `;
            submitBtn.classList.add('opacity-70', 'cursor-not-allowed');

            try {
                // Build form data
                const formData = new FormData(appealForm);

                // Send POST request to the server endpoint (same as original action: /save_appeal)
                // We'll use fetch to handle response and then show modal accordingly
                const response = await fetch('{{ url("/save_appeal") }}', {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'application/json',
                        // Laravel CSRF token is automatically included if we retrieve from meta? Ensure we set meta tag or get from existing.
                        // We'll automatically grab token from existing meta CSRF, but if not present we still attach from @csrf field? Actually formData already includes _token.
                    },
                    body: formData
                });

                let result;
                try {
                    result = await response.json();
                } catch (jsonError) {
                    // If server returns non-JSON (e.g. redirect)
                    result = { success: false, message: 'Unexpected server response. Please try again.' };
                }

                if (response.ok && result.success === true) {
                    // Success modal and reset form
                    showModal('success', 'Appeal Submitted', result.message || 'Your attendance appeal has been successfully submitted. The HR team will review it soon.');
                    appealForm.reset();  // clear all fields
                } else {
                    // error case: display error message from server or generic
                    const errorMsg = result.message || 'Submission failed. Please verify your details or try again later.';
                    showModal('error', 'Submission Error', errorMsg);
                }
            } catch (networkError) {
                console.error('Network error:', networkError);
                showModal('error', 'Connection Error', 'Unable to connect to server. Please check your internet connection and try again.');
            } finally {
                // re-enable button and restore text
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
            }

        });
    });
</script>

{{-- fallback csrf meta if needed (already inside blade, but ensure token passes) --}}
<meta name="csrf-token" content="{{ csrf_token() }}">

{{-- small additional JavaScript to attach CSRF token header for fetch while still using formData (already includes _token thanks to @csrf inside form) --}}
<script>
    // ensure global axios/fetch prefers, but we already embed _token via hidden input.
    // The fetch will automatically send the token because it's part of multipart/form-data.
    // fine-tuning: if you need additional header, it's okay.
    // Also handle error for file size or invalid extension independently?
    // Keep everything clean.
</script>

</body>
</html>