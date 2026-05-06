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
        Schema::create('employee_appeal', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employee_id');
            $table->date('date_excused');
            $table->string('reason');
            $table->string('note')->nullable();
            $table->string('proof_image')->nullable()->default('default.jpg');
            $table->timestamp('appeal_submitted_at')->useCurrent();
            $table->enum('status', ['WAITING', 'ACCEPTED', 'REJECTED'])->default('WAITING');
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
        Schema::dropIfExists('employee_appeal');
    }
};
