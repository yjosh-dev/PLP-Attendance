<?php

namespace App\Http\Controllers;

Router::get('/test', [TestController::class, 'sendHello']);