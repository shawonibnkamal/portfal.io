<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Arr;
use App\Models\User;
use App\Models\Portfolio;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //get all users
        return User::all();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //validation
        $request-> validate([
            'first_name' => ['required', 'string'],
            'last_name' => ['required', 'string'],
            'username' => ['required', 'string','regex:/^[A-Za-z\.\-\_0-9]+$/','not_in:admin,administrator,operator,login,logout,dashboard,body,html,css,robot,robot_txt'],
            'email' => ['required', 'email', 'unique:App\Models\User,email', 'string'],
            'password' => ['required', 'string'],
            'profile_pic_image' => ['image'],
        ]);

        if (Arr::exists($request, 'profile_pic_image') && $request->hasFile('profile_pic_image')) // profile pic submitted
        {
            //rename image and store location to db
            if ($request->file('profile_pic_image')->isValid())
            {
                //rename file
                $originalFileExtension = $request->file('profile_pic_image')->getClientOriginalExtension();
                $imageFileMD5 = md5_file($request->file('profile_pic_image'));
                $dateTimeString = now()->day . '-' . now()->month . '-' . now()->year;
                $newName = $imageFileMD5 . '-' . Auth::guard('api')->user()->id . '-' . $dateTimeString . '.' . $originalFileExtension;

                //$file = $request->file('profile_pic_image')->storeAs('images',$newName);
                $image_path = Storage::disk('public')->putFileAs('images', $request->file('profile_pic_image'), $newName);
                $request->merge(['profile_pic' => $image_path]);
            }
            else
            {
                return response()->json(['error' => 'Invalid file'], 422);
            }
        }

        $request->merge(['password' => Hash::make($request -> password)]);

        //create user
        return User::create($request->all());
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return User::find($id);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        //validation
        $request-> validate([
            'first_name' => ['string'],
            'last_name' => ['string'],
            'username' => ['string','regex:/^[A-Za-z\.\-\_0-9]+$/','not_in:admin,administrator,operator,login,logout,dashboard,body,html,css,robot,robot_txt'],
            'email' => ['email', 'unique:App\Models\User,email', 'string'],
            'password' => ['string'],
            'profile_pic_image' => ['image'],
        ]);

        if (Auth::guard('api')->check())
        {
            if (Arr::exists($request, 'profile_pic_image') && $request->hasFile('profile_pic_image')) // profile pic submitted
            {
                //rename image and store location to db
                if ($request->file('profile_pic_image')->isValid())
                {
                    //rename file
                    $originalFileExtension = $request->file('profile_pic_image')->getClientOriginalExtension();
                    $imageFileMD5 = md5_file($request->file('profile_pic_image'));
                    $dateTimeString = now()->day . '-' . now()->month . '-' . now()->year;
                    $newName = $imageFileMD5 . '-' . Auth::guard('api')->user()->id . '-' . $dateTimeString . '.' . $originalFileExtension;

                    $file = $request->file('profile_pic_image')->storeAs('images',$newName);
                    $request->merge(['profile_pic' => $file]);
                }
                else
                {
                    return response()->json(['error' => 'Invalid file'], 422);
                    //return response(['message' => 'Invalid file']);
                }
            }

            //if password was updated, run this
            if (Arr::exists($request, 'password'))
            {
                $request->merge(['password' => Hash::make($request -> password)]);
            }

            return Auth::guard('api')->user()->update($request->all());
        }
        else
        {
            return response()->json(['error' => 'Invalid login credentials'], 401);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if (Auth::check())
        {
            //return User::destroy($id);
            return Auth::guard('api')->user()->delete();
        }
        else
        {
            return response()->json(['error' => 'Invalid login credentials'], 401);
        }
    }

    public function getPortfolios($username)
    {
        $userInfo = User::where('username', $username)->get();

        $portfolioList = Portfolio::where('user_id', $userInfo[0]->id)->get();

        return response()->json(['userPortfolios' => [$userInfo,$portfolioList]]);
    }


}