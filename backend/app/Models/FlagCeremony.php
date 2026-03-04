<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FlagCeremony extends Model
{
    public $timestamps = false;
    protected $table = "flag_ceremony";
    protected $primaryKey = "flag_ceremony_id";
    
}
