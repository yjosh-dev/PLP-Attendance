<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystemAccountInformation extends Model
{
    public $timestamps = false; 
    
    protected $table = 'system_account_information';
    protected $primaryKey= 'employee_id';

    protected $fillable = [
        'employee_id',
        'first_name',
        'middle_name',
        'last_name'
    ];

    public function account() {
        return $this->belongsTo(SystemAccount::class, 'employee_id');
    }
}
