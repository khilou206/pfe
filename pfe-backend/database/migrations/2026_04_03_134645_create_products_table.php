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
        $table->id('id_utilisateur'); // Laravel كيفضل bigIncremental
        $table->string('nom', 100)->nullable();
        $table->string('role', 50)->nullable();
        $table->string('email', 150)->unique();
        $table->string('mot_de_passe', 255)->nullable();
        $table->timestamps(); // ضروريين فـ Laravel باش تعرف فوقاش تكرات الداتا
    });

    // 2. Adresses
    Schema::create('adresses', function (Blueprint $table) {
        $table->id('id_adresse');
        $table->string('ville', 100)->nullable();
        $table->string('code_postale', 20)->nullable();
        $table->text('adresse')->nullable();
        $table->foreignId('id_utilisateur')->constrained('utilisateurs', 'id_utilisateur')->onDelete('cascade');
        $table->timestamps();
    });

    // 3. Produits
    Schema::create('produits', function (Blueprint $table) {
        $table->id('id_product');
        $table->string('nom_produit', 150)->nullable();
        $table->string('categorie_produit', 100)->nullable();
        $table->text('description_produit')->nullable();
        $table->decimal('prix', 10, 2)->nullable();
        $table->foreignId('id_utilisateur')->constrained('utilisateurs', 'id_utilisateur');
        $table->timestamps();
    });

    // 4. Design & Mockup (خاصهم يتكرياو قبل Images حيت Images كترجع ليهم)
    Schema::create('design', function (Blueprint $table) {
        $table->id('id_design');
        $table->string('nom_design', 100)->nullable();
        $table->timestamp('date_upload')->useCurrent();
        $table->foreignId('id_utilisateur')->constrained('utilisateurs', 'id_utilisateur');
    });

    Schema::create('mockup', function (Blueprint $table) {
        $table->id('id_mockup');
        $table->string('nom_mockup', 100)->nullable();
        $table->string('categorie_mockup', 100)->nullable();
        $table->string('couleur', 50)->nullable();
    });

    // 5. Images
    Schema::create('images', function (Blueprint $table) {
        $table->id('id_image');
        $table->string('nom_image', 255)->nullable();
        $table->foreignId('id_design')->nullable()->constrained('design', 'id_design');
        $table->foreignId('id_mockup')->nullable()->constrained('mockup', 'id_mockup');
        $table->foreignId('id_product')->nullable()->constrained('produits', 'id_product');
    });

    // 6. Commandes
    Schema::create('commandes', function (Blueprint $table) {
        $table->id('id_commande');
        $table->timestamp('date_commande')->useCurrent();
        $table->string('statut_commande', 50)->nullable();
        $table->foreignId('id_utilisateur')->constrained('utilisateurs', 'id_utilisateur');
        $table->foreignId('id_adresse')->constrained('adresses', 'id_adresse');
    });

    // 7. Pivot Tables (Porter & Poster)
    Schema::create('porter', function (Blueprint $table) {
        $table->foreignId('id_commande')->constrained('commandes', 'id_commande')->onDelete('cascade');
        $table->foreignId('id_product')->constrained('produits', 'id_product');
        $table->integer('qte')->default(1);
        $table->string('color', 50)->nullable();
        $table->primary(['id_commande', 'id_product']);
    });

    Schema::create('poster', function (Blueprint $table) {
        $table->foreignId('id_product')->constrained('produits', 'id_product')->onDelete('cascade');
        $table->foreignId('id_image')->constrained('images', 'id_image')->onDelete('cascade');
        $table->primary(['id_product', 'id_image']);
    });
}
    public function down(): void
    {
        Schema::dropIfExists('poster');
        Schema::dropIfExists('porter');
        Schema::dropIfExists('images');
        Schema::dropIfExists('mockup');
        Schema::dropIfExists('design');
        Schema::dropIfExists('commandes');
        Schema::dropIfExists('produits');
        Schema::dropIfExists('adresses');
        Schema::dropIfExists('utilisateurs');
    }
};