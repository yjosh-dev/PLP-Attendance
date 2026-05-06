@extends('layout.guest')
@section('title', 'Login')

@section('styles')
  <link rel="stylesheet" href="{{ asset('css/auth/login.css') }}">
@endsection

@section('content')
  <div class="card inter">

    {{-- LOGO --}}
    <div class="circle">
      <img src="{{ asset('assets/icons/plp.png') }}"/>
    </div>

    @if($errors->any())
    <div id="error-modal" class="flex items-center justify-between gap-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg w-full z-90">
      <div class="flex flex-col">
        @foreach($errors->all() as $error)
          <span class="text-sm">{{ $error }}</span>
        @endforeach
      </div>
      <button onclick="document.getElementById('error-modal').remove()" class="text-red-500 hover:text-red-700 font-bold text-lg leading-none">
        ✕
      </button>
     </div>
    @endif

    {{-- HERO --}}
    <div class="hero">
      <h1 id="main-text">Welcome Back!</h1>
      <p id="sub-text">Sign in to your PLP account</p>
    </div>

    {{-- FORM --}}
    <form method="POST" action='/login/employee'>
      @csrf
      <fieldset>
        <legend>Email</legend>
        <input type="email" id="email" name="email" placeholder="sample@plp.edu.ph" required/>
      </fieldset>

      <fieldset>
        <legend>Password</legend>
        <input type="password" id="password" name="password" placeholder="••••••••••••••" required/>
      </fieldset>

      <div class="forgot-row">
        <a>Forgot password?</a>
      </div>

      <button type="submit" class="btn-login">Log in &#8594;</button>
    </form>

    <p class="card-footer">&copy; 2026 Pamantasan ng Lungsod ng Pasig</p>

  </div>
@endsection