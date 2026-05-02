<?php

namespace App\Http\Controllers;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckAdmin
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. واش المستخدم داير Login؟
        // 2. واش الـ role ديالو هو 'administrateur'؟
        if (Auth::check() && Auth::user()->role === 'administrateur') {
            return $next($request);
        }

        // إيلا ما كانش admin، صيفط ليه Error 403 (Forbidden)
        return response()->json([
            'status' => 'failed',
            'message' => 'Accès refusé. Réservé aux administrateurs.'
        ], 403);
    }
}