<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>@yield('title') - PLP</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  </head>
  <body class="flex flex-col w-screen h-screen bg-[#EDEDED]">
    <div class="w-full h-[88%] flex flex-col items-center">
      <div class="w-full h-[30%] bg-black rounded-b-[60px] z-1">
      </div>
      <div class="w-[80%] h-[50%] bg-white rounded-xl z-3 absolute mt-[10vh]">
        @yield('content')
      </div>
    </div>
    <div class="w-full h-[12%] bg-white rounded-t-[40px] flex items-center justify-center gap-20">
      @yield('navbar')
    </div>
  </body>
</html>