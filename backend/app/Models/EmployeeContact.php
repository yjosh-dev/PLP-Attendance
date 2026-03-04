<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeContact extends Model
{
    public $timestamps = false;
    protected $table = 'employee_account_contact';
    protected $primaryKey = 'employee_id';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        "employee_id",
        "email",
        "phone_number",
        "address"
    ];

    public function account(){
        return $this->belongsTo(EmployeeAccount::class, 'employee_id');
    }
}
