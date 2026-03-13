<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('flag_ceremony_record', function (Blueprint $table) {
            $table->id('record_id');
            $table->unsignedBigInteger('flag_ceremony_id');
            $table->unsignedBigInteger('employee_id');
            $table->time('time_in');
            $table->time('time_out')->nullable;
            $table->enum('status', ['pending', 'present', 'early-out','absent', 'excused'])->pending('pending');   

            $table->foreign('flag_ceremony_id')
                   ->references('flag_ceremony_id')
                   ->on('flag_ceremony')
                   ->onDelete('cascade');

            $table->foreign('employee_id')
                   ->references('employee_id')
                   ->on('employee_account')
                   ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('flag_ceremony_record');
    }
};
