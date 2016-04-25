/**
 * Created by sb on 17.04.2016.
 */

var passport       = require( 'passport' ),
    FacebookStrategy = require( 'passport-facebook' ).Strategy,
    User = require( '../../models/userModel' );

module.exports = function()
{
  passport.use( new FacebookStrategy(
    {
      clientID: 'KEY',
      clientSecret: 'KEY',
      callbackURL: 'http://localhost:3000/auth/facebook/callback',
      passReqToCallback: true
    },
    function( req, accessToken, refreshToken, profile, done )
    {
      /*
      * Описание есть в twitter.strategy.js
      * */
      if( req.user )
      {
        var query = {};
        
        if( req.user.google )
        {
          console.log( 'google' );
          
          query = {
            'google.id': req.user.google.id
          };
        }
        else if( req.user.twitter )
        {
          query = {
            'twitter.id': req.user.twitter.id
          };
        }
        
        User.findOne( query, function( error, user )
        {
          console.log( error );
          console.log( 'user' );
          
          if( user )
          {
            user.facebook       = {};
            user.facebook.id    = profile.id;
            user.facebook.token = accessToken;

            user.save();
            done( null, user );
          }
        } );
      }
      else
      {
        var query = {
          'facebook.id': profile.id
        };

        User.findOne( query, function( error, user )
        {
          if( user )
          {
            console.log( 'found' );
            done( null, user );
          }
          else
          {
            console.log( 'not found' );
            var user = new User;

            user.email = profile.emails[ 0 ].value;
            user.displayName = profile.displayName;

            user.facebook       = {};
            user.facebook.id    = profile.id;
            user.facebook.token = accessToken;

            user.save();
            done( null, user );
          }
        } )
      }

    }
  ));
};