<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeAccount extends Model
{
    public $timestamps = false;
    protected $table = 'employee_account';
    protected $primaryKey = 'employee_id';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        "employee_id",
        "account_email",
        "account_password",
        "account_created_at"
    ];

    public function information() {
        return $this->hasOne(EmployeeInformation::class, 'employee_id');
    }

    public function contact() {
         return $this->hasOne(EmployeeContact::class, 'employee_id');
    }

    public function history(){
        return $this->hasOne(FlagCeremonyRecord::class, 'employee_id');
    }

    public function appeal(){
        return $this->hasOne(EmployeeAppeal::class, 'employee_id');
    }
}
