<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Employee Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body class="bg-gradient-to-br from-purple-500 to-indigo-600 min-h-screen font-sans antialiased">
    <div class="container mx-auto px-4 py-8">
        <div class="max-w-4xl mx-auto">
            <!-- Main Card -->
            <div class="bg-white rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300">
                
                <!-- Header Section with Gradient -->
                <div class="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-12 text-center">
                    <div class="w-32 h-32 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                        <i class="fas fa-user-circle text-6xl text-purple-600"></i>
                    </div>
                    <h1 class="text-3xl font-bold text-white mb-2" id="employeeName">
                        {{ session('employee_data.information.first_name', '') }} 
                        {{ session('employee_data.information.middle_name', '') }} 
                        {{ session('employee_data.information.last_name', '') }}
                    </h1>
                    <p class="text-purple-200 text-lg" id="employeeDepartment">
                        {{ session('employee_data.information.department', 'College of Fentanyl') }}
                    </p>
                </div>

                <!-- Contact Section -->
                <div class="px-8 py-6 border-b border-gray-200">
                    <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <i class="fas fa-address-card text-purple-600"></i>
                        Contact
                    </h2>
                    <p class="text-gray-600 leading-relaxed">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br>
                        Cras eleifend cursus efficitur. Cras orci neque
                    </p>
                </div>

                <!-- Performance Section -->
                <div class="px-8 py-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <i class="fas fa-chart-line text-green-600"></i>
                        Continue good performance
                    </h3>
                    
                    <div class="bg-gray-50 rounded-xl p-4">
                        <div class="flex justify-between items-center mb-3">
                            <span class="text-gray-600 font-medium">Month</span>
                            <span class="text-gray-800 font-semibold">Apr 1</span>
                        </div>
                        <div class="flex justify-between items-center pt-3 border-t border-gray-200">
                            <span class="text-gray-600">Rating</span>
                            <span class="text-2xl font-bold text-green-600">A+ 95%</span>
                        </div>
                    </div>

                    <!-- Last Updated -->
                    <div class="mt-6 text-right">
                        <p class="text-sm text-gray-400">
                            <i class="far fa-calendar-alt mr-1"></i>
                            Last updated: April 22, 2025
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Debug Section (Remove after testing) -->
    @if(config('app.debug'))
    <div class="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded">
        <pre>{{ json_encode(session('employee_data'), JSON_PRETTY_PRINT) }}</pre>
    </div>
    @endif
</body>
</html>