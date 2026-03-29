<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FlagCeremonyRecord extends Model
{
    public $timestamps = false;
    protected $table = "flag_ceremony_record";
    protected $primaryKey = "record_id";

    protected $fillable = [
        "flag_ceremony_id",
        "employee_id",
        "time_in",
        "time_out",
        "status"
    ];
}
