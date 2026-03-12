<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FlagCeremony extends Model
{
    public $timestamps = false;
    protected $table = "flag_ceremony";
    protected $primaryKey = "flag_ceremony_id";
    
    protected $fillable = [
        "flag_ceremony_date",
        "flag_ceremony_start",
        "flag_ceremony_end",
        "status",
        "created_by",
        "created_at"
    ];

    public function ceremonyRecord() {
        return $this->hasOne(FlagCeremonyRecord::class, 'flag_ceremony_id');
    }
}
