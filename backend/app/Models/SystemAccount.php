<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class SystemAccount extends Model
{    
     use HasApiTokens;
     public $timestamps = false;
  
     protected $table = 'system_account';
     protected $primaryKey = 'employee_id';
    
     protected $fillable = [
          'account_email',
          'account_password',
          'user_type',
          'account_created_on'
     ];

     public function information() {
        return $this->hasOne(SystemAccountInformation::class, 'employee_id');
     }
}
