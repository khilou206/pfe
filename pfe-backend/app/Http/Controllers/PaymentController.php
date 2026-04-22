<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use App\Models\Commande; 
use App\Models\Adresse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller {
    public function checkout(Request $request) {
        // 1. إعداد Stripe
       Stripe::setApiKey(config('services.stripe.secret') ?? env('STRIPE_SECRET'));
        Stripe::setVerifySslCerts(false); // لتجاوز مشكلة SSL في XAMPP

        try {
            return DB::transaction(function () use ($request) {
                $lineItems = [];
                $totalPrice = 0;

                
                if (!$request->has('items') || empty($request->items)) {
                    return response()->json(['message' => 'السلة فارغة'], 400);
                }

                foreach ($request->items as $item) {
                    $prix = $item['prix'];
                    $quantite = $item['qte'] ?? 1;
                    $totalPrice += ($prix * $quantite);

                    $lineItems[] = [
                        'price_data' => [
                            'currency' => 'mad',
                            'unit_amount' => $prix * 100, 
                            'product_data' => [
                                'name' => (string) ($item['nom_produit'] ?? 'Produit Halla'), 
                            ],
                        ],
                        'quantity' => $quantite,
                    ];
                }


                $adresse = Adresse::create([
                    'ville'          => $request->city,
                    'code_postale'   => $request->zipcode,
                    'adresse'        => $request->address,
                    'id_utilisateur' => auth()->id() ?? 1,
                ]);

                
                $commande = Commande::create([
                    'id_utilisateur' => auth()->id() ?? 1,
                    'id_adresse'     => $adresse->id, 
                    'total_price'    => $totalPrice,
                    'status'         => 'pending', 
                ]);

        
                $session = Session::create([
                    'payment_method_types' => ['card'],
                    'line_items' => $lineItems,
                    'mode' => 'payment',
                    'success_url' => 'http://localhost:5173/payment/success?session_id={CHECKOUT_SESSION_ID}',
                    'cancel_url'  => 'http://localhost:5173/cart',
                    'metadata' => [
                        'commande_id' => $commande->id
                    ]
                ]);

                $commande->update(['stripe_id' => $session->id]);

                return response()->json(['url' => $session->url]);
            });

        } catch (\Exception $e) {
            Log::error('Stripe Error: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur: ' . $e->getMessage()], 500);
        }
    }

    public function verify($sessionId) {
       // عوض ما تحط sk_test... حط هاد السطر:
Stripe::setApiKey(config('services.stripe.secret') ?? env('STRIPE_SECRET'));
        Stripe::setVerifySslCerts(false);
        
        try {
            $session = Session::retrieve($sessionId);
            if ($session->payment_status === 'paid') {
                $commande = Commande::where('stripe_id', $sessionId)->first();
                if ($commande) {
                    $commande->update(['status' => 'paid']);
                    return response()->json(['status' => 'success']);
                }
            }
            return response()->json(['status' => 'failed'], 400);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}