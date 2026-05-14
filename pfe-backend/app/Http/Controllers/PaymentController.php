<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use App\Models\Commande;
use App\Models\Adresse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
//---------------------------------------------------------------------------------------------------
    public function checkout(Request $request)
    {
        Stripe::setApiKey(config('services.stripe.secret') ?? env('STRIPE_SECRET'));
        Stripe::setVerifySslCerts(false);
        try {
            return DB::transaction(function () use ($request) {

                $lineItems = [];
                $totalPrice = 0;
                if (!$request->has('items') || empty($request->items)) {
                    return response()->json([
                        'message' => 'السلة فارغة'
                    ], 400);
                }
                foreach ($request->items as $item) {
                    $price = $item['prix'] ?? $item['price'] ?? 0;
                    $qty   = $item['qte'] ?? 1;
                    $totalPrice += ($price * $qty);
                    $lineItems[] = [
                        'price_data' => [
                            'currency' => 'mad', 
                            'unit_amount' => $price * 100, 
                            'product_data' => [
                                'name' => (string) ($item['nom_produit'] ?? 'Produit'),
                            ],
                        ],
                        'quantity' => $qty,
                    ];
                }
                $adresse = Adresse::create([
                    'ville'          => $request->city,
                    'code_postale'   => $request->zipcode,
                    'adresse'        => $request->address,
                    'id_utilisateur' => auth()->id(),
                ]);

                $reference = 'CMD-' . strtoupper(uniqid());

                $commande = Commande::create([
                    'id_utilisateur'     => auth()->id(),
                    'id_adresse'         => $adresse->id,
                    'total_price'        => $totalPrice,
                    'status'             => 'paid',
                    'reference_commande' => $reference,
                ]);
                foreach ($request->items as $item) {
                    $commande->produits()->attach($item['id'], [
                        'qte' => $item['qte'] ?? 1
                    ]);
                }
                $session = Session::create([
                    'payment_method_types' => ['card'],
                    'line_items'           => $lineItems,
                    'mode'                 => 'payment',

                    'success_url' => 'http://localhost:5173/payment/success?session_id={CHECKOUT_SESSION_ID}',
                    'cancel_url'  => 'http://localhost:5173/panier',

                    'metadata' => [
                        'commande_id' => $commande->id
                    ]
                ]);
                $commande->update([
                    'stripe_id' => $session->id
                ]);
                return response()->json([
                    'url' => $session->url
                ]);
            });

        } catch (\Exception $e) {
            Log::error('Stripe Checkout Error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erreur de paiement: ' . $e->getMessage()
            ], 500);
        }
    }
//---------------------------------------------------------------------------------------------------
    public function verify($sessionId)
    {
        Stripe::setApiKey(config('services.stripe.secret') ?? env('STRIPE_SECRET'));
        Stripe::setVerifySslCerts(false);

        try {
            $session = Session::retrieve($sessionId);
            if ($session->payment_status === 'paid') {
                $commande = Commande::where('stripe_id', $sessionId)->first();

                if ($commande) {
                    $commande->update([
                        'status' => 'paid'
                    ]);
                    return response()->json([
                        'status' => 'success'
                    ]);
                }
            }

            return response()->json([
                'status' => 'failed'
            ], 400);

        } catch (\Exception $e) {
            Log::error('Stripe Verify Error: ' . $e->getMessage());

            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}