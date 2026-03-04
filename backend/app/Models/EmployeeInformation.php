<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeInformation extends Model
{
    public $timestamps = false;
    protected $table = 'employee_account_information';
    protected $primaryKey = 'employee_id';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        "employee_id",
        "first_name",
        "middle_name",
        "last_name",
        "department",
        "position",
        "birthdate",       
        "profile_image"   
    ];

    public function account() {
        return $this->belongsTo(EmployeeAccount::class, 'employee_id');
    }
}
