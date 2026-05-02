<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Utilisateurs
        Schema::create('utilisateurs', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 100)->nullable();
            // تأكدت أن الـ roles هما اللي غاتخدم بيهم في الـ Middleware
            $table->enum('role', ['administrateur', 'utilisateur'])->default('utilisateur');
            $table->string('email', 150)->unique();
            $table->string('mot_de_passe', 255)->nullable();
            $table->string('tel')->nullable();
            $table->timestamps();
        });

        // 2. Adresses
        Schema::create('adresses', function (Blueprint $table) {
            $table->id();
            $table->string('ville', 100)->nullable();
            $table->string('code_postale', 20)->nullable();
            $table->text('adresse')->nullable();
            $table->foreignId('id_utilisateur')->constrained('utilisateurs')->onDelete('cascade');
            $table->timestamps();
        });

     
        Schema::create('produits', function (Blueprint $table) {
            $table->id();
            $table->string('nom_produit', 150)->nullable();
            $table->string('categorie_produit', 100)->nullable();
            $table->text('description_produit')->nullable();
            $table->decimal('prix', 10, 2)->nullable();
            // زدنا onDelete('cascade') باش إيلا تمسح الـ User يتمسحو منتجاتو
            $table->foreignId('id_utilisateur')->constrained('utilisateurs')->onDelete('cascade');
            $table->string('final_mockup')->nullable();
            $table->boolean('is_public')->default(false);
            $table->string('color');
            $table->timestamps();
        });

      
        Schema::create('design', function (Blueprint $table) {
            $table->id();
            $table->string('nom_design', 100)->nullable();
            $table->timestamp('date_upload')->useCurrent();
            $table->foreignId('id_utilisateur')->constrained('utilisateurs')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('mockup', function (Blueprint $table) {
            $table->id();
            $table->string('nom_mockup', 100)->nullable();
            $table->string('categorie_mockup', 100)->nullable();
            $table->string('couleur', 50)->nullable();
            $table->timestamps();
        });

        // 5. Images
        Schema::create('images', function (Blueprint $table) {
            $table->id();
            $table->string('nom_image', 255)->nullable();
            $table->foreignId('id_design')->nullable()->constrained('design')->onDelete('cascade');
            $table->foreignId('id_mockup')->nullable()->constrained('mockup')->onDelete('cascade');
            $table->foreignId('id_product')->nullable()->constrained('produits')->onDelete('cascade');
            $table->integer('x')->nullable();
            $table->integer('y')->nullable();
            $table->integer('width')->nullable();
            $table->integer('height')->nullable();
            $table->timestamps();
        });

        // 6. Commandes
        Schema::create('commandes', function (Blueprint $table) {
            $table->id();
            // زدنا رقم الطلبية باش الـ Admin يتعامل معاه (REF-0001)
            $table->string('reference_commande')->unique()->nullable();
            $table->foreignId('id_utilisateur')->constrained('utilisateurs')->onDelete('cascade');
            $table->foreignId('id_adresse')->constrained('adresses');
            $table->string('stripe_id')->nullable();
            $table->decimal('total_price', 10, 2);
            // زدنا حالات كثر باش الـ Admin يتحكم في الطلب
            $table->enum('status', ['pending', 'paid', 'failed', 'shipped', 'delivered'])->default('pending');
            $table->timestamps();
        });

        // 7. Pivot Tables
        Schema::create('porter', function (Blueprint $table) {
            $table->foreignId('id_commande')->constrained('commandes')->onDelete('cascade');
            $table->foreignId('id_product')->constrained('produits')->onDelete('cascade');
            $table->integer('qte')->default(1);
            $table->string('color', 50)->nullable();
            $table->primary(['id_commande', 'id_product']);
            $table->timestamps();
        });

        Schema::create('poster', function (Blueprint $table) {
            $table->foreignId('id_product')->constrained('produits')->onDelete('cascade');
            $table->foreignId('id_image')->constrained('images')->onDelete('cascade');
            $table->primary(['id_product', 'id_image']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('poster');
        Schema::dropIfExists('porter');
        Schema::dropIfExists('images');
        Schema::dropIfExists('commandes');
        Schema::dropIfExists('mockup');
        Schema::dropIfExists('design');
        Schema::dropIfExists('produits');
        Schema::dropIfExists('adresses');
        Schema::dropIfExists('utilisateurs');
    }
};