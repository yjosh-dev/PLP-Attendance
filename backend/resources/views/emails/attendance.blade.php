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
        h2 { color: #1a1a2e; font-size: 20px; margin: 0 0 8px; }
        p { color: #666; font-size: 14px; line-height: 1.6; margin: 0 0 20px; }
        .panel { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .panel table { width: 100%; border-collapse: collapse; }
        .panel td { padding: 6px 0; font-size: 13px; color: #374151; }
        .panel td:first-child { font-weight: bold; color: #2d6a4f; width: 130px; }
        .btn { display: block; text-align: center; background: #2d6a4f; color: #fff !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: bold; margin: 24px 0; }
        .warning { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 12px 16px; font-size: 12px; color: #92400e; margin-top: 16px; }
        .footer { text-align: center; margin-top: 24px; font-size: 11px; color: #9ca3af; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="card">
            <div class="logo">
                <span>PAMANTASAN NG LUNGSOD NG PASIG</span>
            </div>

            <h2>Welcome, {{ $data['first_name'] }} {{ $data['last_name'] }}!</h2>
            <p>Your employee account has been successfully created. Here are your login credentials:</p>

            <div class="panel">
                <table>
                    <tr>
                        <td>Employee ID</td>
                        <td>{{ $data['employee_id'] }}</td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td>{{ $data['email'] }}</td>
                    </tr>
                    <tr>
                        <td>Password</td>
                        <td>{{ $data['password'] }}</td>
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

            <a href="#" class="btn">Login to your account</a>

            <div class="warning">
                ⚠ Please change your password after your first login and do not share these credentials with anyone.
            </div>
        </div>

        <div class="footer">
            &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
        </div>
    </div>
</body>
</html>