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
            Schema::create('system_account', function (Blueprint $table) {
                $table->increments('employee_id');
                $table->string('account_email', 100)->unique();
                $table->string('account_password', 255);
                $table->enum('user_type', ['administrator', 'hr']);
                $table->timestamp('account_created_on')->useCurrent();
            });
        }

        /**
         * Reverse the migrations.
         */
        public function down(): void
        {
            Schema::dropIfExists('system_account');
        }
    };
