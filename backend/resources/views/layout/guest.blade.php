<!DOCTYPE html>
<html>
  <head>
    <title>@yield('title')</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
     @yield('styles')
  </head>

  <body class="bg-[url('/assets/img/plp.webp')] bg-cover bg-center bg-no-repeat h-screen">
    <div class="w-dvw h-dvh bg-green-900/75 flex items-center justify-center">
        @yield('content')
    </div>
  </body>
</html>