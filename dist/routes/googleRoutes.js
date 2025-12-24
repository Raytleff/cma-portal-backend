import express from 'express';
import passport from 'passport';
import { successHandler, errorHandler, signoutHandler, } from '../controller/googleController';
const router = express.Router();
// request at /auth/google, when the user clicks sign-up with google button transferring
// the request to the google server, to show emails screen
router.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }));
// URL Must be the same as 'Authorized redirect URIs' field of OAuth client, i.e: /auth/google/callback
//failureRedirect: '/auth/google/error'
router.get('/callback', passport.authenticate('google', { failureRedirect: "http://localhost:3000" }), successHandler);
router.get('/success', successHandler);
router.get('/error', errorHandler);
router.post('/signout', signoutHandler);
export default router;
