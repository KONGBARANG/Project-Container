<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'username' => 'required|string|min:3|max:30|alpha_dash|unique:users,username',
            'password' => 'required|string|min:6',
        ]);

        $user = new User();
        $user->name = $data['name'];
        $user->username = $data['username'];
        $user->email = $data['username'] . '@shop.local';
        $user->password = $data['password'];
        $user->role = 'customer';
        $user->save();

        return $this->respondWithToken($user, 201);
    }

    public function login(Request $request)
    {
        return $this->attempt($request, false);
    }

    public function adminLogin(Request $request)
    {
        return $this->attempt($request, true);
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        $user->api_token = null;
        $user->save();

        return response()->json(['message' => 'Logged out']);
    }

    private function attempt(Request $request, bool $adminOnly)
    {
        $data = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('username', $data['username'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Wrong username or password'], 422);
        }

        if ($adminOnly && $user->role !== 'admin') {
            return response()->json(['message' => 'This account is not an admin'], 403);
        }

        return $this->respondWithToken($user);
    }

    private function respondWithToken(User $user, int $status = 200)
    {
        $token = Str::random(60);
        $user->api_token = hash('sha256', $token);
        $user->save();

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'role' => $user->role,
            ],
        ], $status);
    }
}