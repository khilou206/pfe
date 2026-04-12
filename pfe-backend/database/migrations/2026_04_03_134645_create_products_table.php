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
        $table->id(); // هادي كتعطي سمية 'id' تلقائياً
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
        // الربط مع utilisateurs (الجدول سميتو utilisateurs والـ PK ديالو هو id)
        $table->foreignId('id_utilisateur')->constrained('utilisateurs')->onDelete('cascade');
        $table->timestamps();
    });

    // 3. Produits
    Schema::create('produits', function (Blueprint $table) {
        $table->id();
        $table->string('nom_produit', 150)->nullable();
        $table->string('categorie_produit', 100)->nullable();
        $table->text('description_produit')->nullable();
        $table->decimal('prix', 10, 2)->nullable();
        $table->foreignId('id_utilisateur')->constrained('utilisateurs');
        $table->timestamps();
    });

    // 4. Design & Mockup
    Schema::create('design', function (Blueprint $table) {
        $table->id();
        $table->string('nom_design', 100)->nullable();
        $table->timestamp('date_upload')->useCurrent();
        $table->foreignId('id_utilisateur')->constrained('utilisateurs');
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
        // هنا رديت البال للربط: كيربط مع 'id' ديال الجداول اللي فوق
        $table->foreignId('id_design')->nullable()->constrained('design')->onDelete('set null');
        $table->foreignId('id_mockup')->nullable()->constrained('mockup')->onDelete('set null');
        $table->foreignId('id_product')->nullable()->constrained('produits')->onDelete('set null');
           $table->timestamps();
    });

    // 6. Commandes
    Schema::create('commandes', function (Blueprint $table) {
        $table->id();
        $table->timestamp('date_commande')->useCurrent();
        $table->string('statut_commande', 50)->nullable();
        $table->foreignId('id_utilisateur')->constrained('utilisateurs');
        $table->foreignId('id_adresse')->constrained('adresses');
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
        // الترتيب مهم بزاف هنا: كنمسحو الجداول اللي فيها Foreign Keys هي الأولى
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