<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // جمعي كاع الـ alias هنا
        $middleware->alias([
            'checkAdmin' => \App\Http\Middleware\CheckAdmin::class,
        ]);

        // إيلا كنتي خدامة بـ Sanctum و React (SPA)
        $middleware->statefulApi(); 
    })
    ->withMiddleware(function (Middleware $middleware) {
    // ✅ CORS لازم يكون أول واحد
    $middleware->prepend(\Illuminate\Http\Middleware\HandleCors::class);
    
    $middleware->alias([
        'checkAdmin' => \App\Http\Middleware\CheckAdmin::class,
    ]);
    
    $middleware->statefulApi();
})
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();