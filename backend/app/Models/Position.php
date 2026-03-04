<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Position extends Model
{
    public $timestamps = false;
    protected $table = 'position';
    protected $primaryKey = 'position_id';

    protected $fillable = [
        'department_id',
        'position_name'
    ];

    public function department() {
        return $this->belongsTo(Department::class, 'department_id');
    }

}
