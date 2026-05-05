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

        // 3. Design (مكتبة الشعارات اللي كيطلع المستخدم)
        Schema::create('design', function (Blueprint $table) {
            $table->id();
            $table->string('nom_design', 100); // رابط الملف
            $table->foreignId('id_utilisateur')->constrained('utilisateurs')->onDelete('cascade');
            $table->timestamps();
        });

        // 4. Mockup (المنتجات الخام اللي كيحط الـ Admin)
        Schema::create('mockup', function (Blueprint $table) {
            $table->id();
            $table->string('nom_mockup'); 
            $table->decimal('prix_base', 10, 2); 
            $table->json('colors')->nullable(); 
            $table->string('categorie_mockup');
            $table->timestamps();
        });

        // 5. Produits (المنتج النهائي - هو اللي فيه كلشي)
        Schema::create('produits', function (Blueprint $table) {
            $table->id();
            $table->string('nom_produit', 150)->nullable();
            $table->foreignId('id_utilisateur')->constrained('utilisateurs')->onDelete('cascade');
            $table->foreignId('id_design')->constrained('design')->onDelete('cascade');
            $table->foreignId('id_mockup')->constrained('mockup')->onDelete('cascade');
            
            // إحداثيات اللوغو (باش الـ Admin يعرف القياسات)
            $table->integer('x')->nullable();
            $table->integer('y')->nullable();
            $table->integer('width')->nullable();
            $table->integer('height')->nullable();

            // مواصفات القطعة
            $table->string('taille')->nullable();
            $table->string('color')->nullable();
            $table->decimal('prix', 10, 2)->nullable();
            $table->string('final_mockup')->nullable(); // صورة الـ Preview للـ Admin
            
            $table->boolean('is_public')->default(false);
            $table->timestamps();
        });

        // 6. Commandes
        Schema::create('commandes', function (Blueprint $table) {
            $table->id();
            $table->string('reference_commande')->unique();
            $table->foreignId('id_utilisateur')->constrained('utilisateurs')->onDelete('cascade');
            $table->foreignId('id_adresse')->constrained('adresses');
            $table->decimal('total_price', 10, 2);
            $table->enum('status', ['pending', 'paid', 'failed', 'shipped', 'delivered'])->default('pending');
            $table->timestamps();
        });

        // 7. Ligne de Commande (باش نربطو الطلبية بالمنتجات)
        Schema::create('commande_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_commande')->constrained('commandes')->onDelete('cascade');
            $table->foreignId('id_produit')->constrained('produits')->onDelete('cascade');
            $table->integer('qte')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commande_items');
        Schema::dropIfExists('commandes');
        Schema::dropIfExists('produits');
        Schema::dropIfExists('mockup');
        Schema::dropIfExists('design');
        Schema::dropIfExists('adresses');
        Schema::dropIfExists('utilisateurs');
    }
};