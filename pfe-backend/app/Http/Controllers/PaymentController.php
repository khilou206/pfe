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
    /**
     * =========================================================
     * 💳 CHECKOUT - CREATE STRIPE PAYMENT SESSION
     * =========================================================
     * - Validate cart items
     * - Create order + address
     * - Attach products (pivot table)
     * - Create Stripe checkout session
     * - Return Stripe payment URL
     */
    public function checkout(Request $request)
    {
        // 🔐 Stripe configuration
        Stripe::setApiKey(config('services.stripe.secret') ?? env('STRIPE_SECRET'));

        // ⚠️ (DEV ONLY) disable SSL verification (remove in production)
        Stripe::setVerifySslCerts(false);

        try {
            return DB::transaction(function () use ($request) {

                $lineItems = [];
                $totalPrice = 0;

                // 📦 1. Check if cart is empty
                if (!$request->has('items') || empty($request->items)) {
                    return response()->json([
                        'message' => 'السلة فارغة'
                    ], 400);
                }

                // 🧮 2. Build Stripe line items + calculate total
                foreach ($request->items as $item) {

                    $price = $item['prix'] ?? $item['price'] ?? 0;
                    $qty   = $item['qte'] ?? 1;

                    $totalPrice += ($price * $qty);

                    $lineItems[] = [
                        'price_data' => [
                            'currency' => 'mad', // ⚠️ Stripe may require 'eur/usd' in real use
                            'unit_amount' => $price * 100, // cents
                            'product_data' => [
                                'name' => (string) ($item['nom_produit'] ?? 'Produit'),
                            ],
                        ],
                        'quantity' => $qty,
                    ];
                }

                // 🏠 3. Create shipping address
                $adresse = Adresse::create([
                    'ville'          => $request->city,
                    'code_postale'   => $request->zipcode,
                    'adresse'        => $request->address,
                    'id_utilisateur' => auth()->id(),
                ]);

                // 🧾 4. Create order (Commande)
                $reference = 'CMD-' . strtoupper(uniqid());

                $commande = Commande::create([
                    'id_utilisateur'     => auth()->id(),
                    'id_adresse'         => $adresse->id,
                    'total_price'        => $totalPrice,
                    'status'             => 'pending',
                    'reference_commande' => $reference,
                ]);

                // 🔗 5. Attach products to order (pivot table)
                foreach ($request->items as $item) {
                    $commande->produits()->attach($item['id'], [
                        'qte' => $item['qte'] ?? 1
                    ]);
                }

                // 💳 6. Create Stripe checkout session
                $session = Session::create([
                    'payment_method_types' => ['card'],
                    'line_items'           => $lineItems,
                    'mode'                 => 'payment',

                    // 🔁 Redirect URLs
       // إذا كان React خدام في منفذ 3000
'success_url' => 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
                    'cancel_url'  => url('/cart'),

                    // 🧠 Metadata for tracking order
                    'metadata' => [
                        'commande_id' => $commande->id
                    ]
                ]);

                // 💾 Save Stripe session ID
                $commande->update([
                    'stripe_id' => $session->id
                ]);

                // 🔗 Return checkout URL
                return response()->json([
                    'url' => $session->url
                ]);
            });

        } catch (\Exception $e) {

            // ❌ Log Stripe errors
            Log::error('Stripe Checkout Error: ' . $e->getMessage());

            return response()->json([
                'message' => 'Erreur de paiement: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * =========================================================
     * ✅ VERIFY PAYMENT STATUS AFTER REDIRECT
     * =========================================================
     * - Check Stripe session
     * - Confirm payment success
     * - Update order status to "paid"
     */
    public function verify($sessionId)
    {
        Stripe::setApiKey(config('services.stripe.secret') ?? env('STRIPE_SECRET'));
        Stripe::setVerifySslCerts(false);

        try {
            // 🔍 Retrieve Stripe session
            $session = Session::retrieve($sessionId);

            // 💰 If payment successful
            if ($session->payment_status === 'paid') {

                // 🔎 Find order linked to Stripe session
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

            // ❌ Error logging
            Log::error('Stripe Verify Error: ' . $e->getMessage());

            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}