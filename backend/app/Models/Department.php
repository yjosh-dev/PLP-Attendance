<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Department extends Model
{
       public $timestamps = false;
       protected $table= 'department';
       protected $primaryKey = 'department_id';

       protected $fillable = [
           'department_name'
       ];
}
