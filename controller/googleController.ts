import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import { registerWithGoogle } from '../service/googleService.js';
import dotenv from 'dotenv';
import { generateToken, refreshGenToken } from '../middleware/generateToken.js';
import { Request, Response } from 'express';
import { Profile } from 'passport';

dotenv.config();

let userProfile: Profile | undefined;
 
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.CALLBACK_URL as string,
    },
    function (accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void) {
      userProfile = profile;
      return done(null, userProfile);
    }
  )
);

//Includes logging in and creating new account and added saving the id in the cookie
export const successHandler = async (req: Request, res: Response) => {
  try {
    const { failure, success } = await registerWithGoogle(userProfile);

    if (failure) {
     // const jwtToken = generateToken(failure.user.id, failure.user.username, failure.user.dateofbirth, failure.user.status);

      const refreshToken = await refreshGenToken(failure.user.id)

        res.cookie('jwt', refreshToken, {
          httpOnly: true, //accessible only by web server 
          secure: true, //https
          sameSite: 'none', //cross-site cookie 
          maxAge: 9 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
      })
      res.redirect("http://localhost:3000/feed");
      /*return res.status(200).json({
        message: 'You have logged in by google',
        user: failure.user,
        token: jwtToken,
      });*/
      
    } else {
      console.log('Registering new Google user:', success.user);

     // const jwtToken = generateToken(success.user.id, success.user.username, success.user.dateofbirth, success.user.status);
      
      const refreshToken = await refreshGenToken(success.user.id)

      res.cookie('jwt', refreshToken, {
          httpOnly: true, //accessible only by web server 
          secure: true, //https
          sameSite: 'none', //cross-site cookie 
          maxAge: 9 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
      })
     res.redirect("http://localhost:3000/feed");
     /* return res.status(201).json({
        message: 'User registered successfully.',
        user: success.user,
        token: jwtToken,
      });*/
    }
    
  } catch (error) {
    console.error('Error registering Google user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const errorHandler = (req: Request, res: Response) => res.send('Error logging in via Google..');

export const signoutHandler = (req: Request, res: Response) => {
  try {
    req.session.destroy(function (err: any) {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ message: 'Internal Server Error during session destruction' });
      }
      console.log({msg: 'Session Destroyed!' });
      
      const cookies = req.cookies;

      if (!cookies?.jwt) {
        return res.sendStatus(204); // No content
      }

      res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        //path: '/', // Specify the path to ensure it matches the path where the cookie was set
      });

      return res.json({ message: 'User signed out successfully', msgCcookies: 'Cookies Cleared!' });
    });
  } catch (err: any) {
    console.error('Error signing out user:', err);
    return res.status(400).json({ message: 'Failed to sign out user', error: err.message });
  }
};