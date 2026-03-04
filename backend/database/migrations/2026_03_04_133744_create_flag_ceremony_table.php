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
        Schema::create('flag_ceremony', function (Blueprint $table) {
            $table->id('flag_ceremony_id');
            $table->date('flag_ceremony_date');
            $table->time('flag_ceremony_start');
            $table->time('flag_ceremony_end');
            $table->unsignedInteger('created_by');
            $table->timestamp('created_at')->useCurrent(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flag_ceremony');
    }
};
