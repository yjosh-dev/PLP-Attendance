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
        Schema::create('employee_account', function (Blueprint $table) {
            $table->unsignedBigInteger('employee_id')->primary();
            $table->string('account_email');
            $table->string('account_password');
            $table->timestamp('account_created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_account');
    }
};
