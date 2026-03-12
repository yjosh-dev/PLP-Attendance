<?php

namespace App\DTO;

use Carbon\Carbon;

class ScheduleDataDTO {
    public function __construct(
        public readonly Carbon $now,
        public readonly string $start_official,
        public readonly string $start_accepting,
        public readonly string $start_date,
    ){}
}
