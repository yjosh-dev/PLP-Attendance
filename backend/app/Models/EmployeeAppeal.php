<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\EmployeeAccount;

class EmployeeAppeal extends Model

{
    public $timestamps = false;

    protected $table = 'employee_appeal';
    protected  $primaryKey = 'id';

    protected $fillable = [
        "employee_id",
        "date_excused",
        "reason",
        "note",
        "proof_image",
        "appeal_submitted_at",
        "status",
    ];

    public function account(){
        return $this->belongsTo(EmployeeAccount::class, 'employee_id');
    }
}
