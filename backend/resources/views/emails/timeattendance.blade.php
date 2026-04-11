<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 30px; margin: 0; }
        .wrapper { max-width: 480px; margin: 0 auto; }
        .card { background: #fff; border-radius: 12px; padding: 32px; box-shadow: 0 2px 12px rgba(0,0,0,0.07); }
        .logo { text-align: center; margin-bottom: 24px; }
        .logo span { font-size: 22px; font-weight: bold; color: #2d6a4f; }
        .badge { text-align: center; margin: 16px 0; }
        .badge span { display: inline-block; background: #dcfce7; color: #16a34a; font-size: 13px; font-weight: bold; padding: 6px 16px; border-radius: 999px; letter-spacing: 0.5px; }

        h2 { color: #1a1a2e; font-size: 20px; margin: 0 0 8px; }
        p { color: #666; font-size: 14px; line-height: 1.6; margin: 0 0 20px; }

        .panel { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .panel table { width: 100%; border-collapse: collapse; }
        .panel td { padding: 6px 0; font-size: 13px; color: #374151; }
        .panel td:first-child { font-weight: bold; color: #2d6a4f; width: 130px; }

        .message-box { 
            text-align: center; 
            background: #f0fdf4; 
            border: 2px solid #86efac; 
            border-radius: 10px; 
            padding: 18px; 
            margin: 20px 0; 
        }
        .message-box .message-text { 
            font-size: 16px; 
            font-weight: bold; 
            color: #15803d; 
            letter-spacing: 0.5px; 
        }

        .note { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 16px; font-size: 12px; color: #166534; margin-top: 16px; }
        .footer { text-align: center; margin-top: 24px; font-size: 11px; color: #9ca3af; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="card">
            <div class="logo">
                <span>PAMANTASAN NG LUNGSOD NG PASIG</span>
            </div>

            <div class="badge">
                <span>ATTENDANCE RECORDED</span>
            </div>

            <h2>Good day, {{ $data['first_name'] }} {{ $data['last_name'] }}!</h2>

            <p>Your time in has been successfully recorded. Here is your attendance summary for today:</p>

            <div class="message-box">
                <div class="message-text">{{ $status_message }}</div>
            </div>

            <div class="panel">
                <table>
                    <tr>
                        <td>Employee ID</td>
                        <td>{{ $data['employee_id'] }}</td>
                    </tr>
                    <tr>
                        <td>Full Name</td>
                        <td>{{ $data['first_name'] }} {{ $data['middle_name'] }} {{ $data['last_name'] }}</td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td>{{ $data['account_email'] }}</td>
                    </tr>
                    <tr>
                        <td>Department</td>
                        <td>{{ $data['department'] }}</td>
                    </tr>
                    <tr>
                        <td>Position</td>
                        <td>{{ $data['position'] }}</td>
                    </tr>
                </table>
            </div>

            <div class="note">
                📋 If you believe this record is incorrect, please contact your HR administrator immediately.
            </div>
        </div>

        <div class="footer">
            &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
        </div>
    </div>
</body>
</html>