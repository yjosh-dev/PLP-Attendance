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
        Schema::create('employee_account_information', function (Blueprint $table) {
            $table->unsignedBigInteger('employee_id')->primary;
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('department');
            $table->string('position');
            $table->date('birthdate');
            $table->string('profile_image')->nullable()->default('default.jpg');
            
            $table->foreign('employee_id')
                  ->references('employee_id')
                  ->on('employee_account')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_account_information');
    }
};
