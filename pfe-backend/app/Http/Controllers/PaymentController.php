<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session;

class PaymentController extends Controller
{
    public function checkout(Request $request)
    {
        // 1. Set API Key (Dima diha f .env f l-7aqiqa)
        Stripe::setApiKey("!!!!!!!!!!!! dir hna lcode li sift lik !!!!!!!!");
        $panier = $request->all(); // L-panier jey mn React
        $lineItems = [];

        foreach ($panier as $item) {
            $lineItems[] = [
                'price_data' => [
                    'currency' => 'mad',
                    'product_data' => [
                        'name' => $item['nom'] . ' (Couleur: ' . ($item['color'] ?? 'Standard') . ')',
                    ],
                    'unit_amount' => $item['prix'] * 100, 
                ],
                'quantity' => $item['qte'],
            ];
        }

        try {
            $session = Session::create([
                'payment_method_types' => ['card'],
                'line_items'           => $lineItems,
                'mode'                 => 'payment',
                'invoice_creation'     => ['enabled' => true],
                'success_url'          => 'http://localhost:3000/checkout?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url'           => 'http://localhost:3000/cart',
            ]);

            return response()->json(['id' => $session->id]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
//==========================================================================================================

    public function verify(Request $request, $sessionId)
    {
        $stripeSecret = config('services.stripe.secret'); // أو استخدم env('STRIPE_SECRET')
        try {
            $session = \Stripe\Checkout\Session::retrieve($sessionId);
            
            if ($session->payment_status === 'paid') {
                return response()->json(['status' => 'paid']);
            }
            
            return response()->json(['status' => 'unpaid'], 400);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}