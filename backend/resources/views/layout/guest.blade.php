<!DOCTYPE html>
<html lang="en">
  <head>
    <title>@yield('title') — PLP</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    @yield('styles')
  </head>

  <body class="bg-[url('/assets/img/plp.webp')] bg-cover bg-center bg-no-repeat">
    <div class="min-h-dvh w-full bg-green-900/75 flex items-center justify-center px-4">
      @yield('content')
    </div>
  </body>
</html>