<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $loginInfo = $request->validate([
            'email' => ['required','string'],
            'password' => ['required','string'],
        ]);

        if (Auth::attempt($loginInfo))
        {
            $loginToken = Auth::user()->createToken('loginToken')->accessToken;

            return response([Auth::user(), 'login_token' => $loginToken]);
        }
        else
        {
            return response(['message' => 'Invalid login credentials']);
        }

    }

    public function logout(Request $request)
    {
        if (Auth::check()) {
            Auth::user()->AauthAcessToken()->delete();
         }
        Auth::logout();
    }
}