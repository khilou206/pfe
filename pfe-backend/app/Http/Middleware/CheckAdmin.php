<?php

namespace App\Http\Middleware; // تأكد أنها Middleware ماشي Controllers

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckAdmin
{
    public function handle(Request $request, Closure $next)
    {
        // تأكد أن المستخدم "أدمين" حسب السيستيم ديالك
        if (Auth::check() && Auth::user()->role === 'administrateur') {
            return $next($request);
        }

        return response()->json(['message' => 'Accès refusé. Vous n\'êtes pas administrateur.'], 403);
    }
}