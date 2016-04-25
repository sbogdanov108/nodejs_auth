var express = require( 'express' ),
    passport = require( 'passport' );

var router  = express.Router();

/*
* Google
* */
router.route( '/google/callback' )
  .get( passport.authenticate( 'google',
    {
      successRedirect: '/users/',
      failure: '/error/'
    } ));

router.route( '/google' )
  .get( passport.authenticate( 'google',
    {
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ] // какие api используем
    }));

/*
* Twitter
* */
router.route( '/twitter/callback' )
  .get( passport.authenticate( 'twitter',
    {
      successRedirect: '/users/',
      failure: '/error/'
    } ));

router.route( '/twitter' )
  .get( passport.authenticate( 'twitter' ) );

/*
* Facebook
* */
router.route( '/facebook' )
  .get( passport.authenticate( 'facebook',
    {
      scope: [ 'email', 'user_friends']
    }) );

router.route( '/facebook/callback' )
  .get( passport.authenticate( 'facebook',
    {
      successRedirect: '/users',
      failureRedirect: '/error'
    } ) );

module.exports = router;
