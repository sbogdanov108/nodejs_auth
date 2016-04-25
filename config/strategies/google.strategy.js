/**
 * Created by sb on 17.04.2016.
 */

var passport = require( 'passport' ),
    GoogleStrategy = require( 'passport-google-oauth' ).OAuth2Strategy,
    User = require( '../../models/userModel' );

module.exports = function()
{
  passport.use( new GoogleStrategy(
    {
      clientID    : 'KEY.apps.googleusercontent.com',
      clientSecret: 'KEY',
      callbackURL : 'http://localhost:3000/auth/google/callback'
    },
    function( req, accessToken, refreshToken, profile, done )
    {
      var user = {},
          query = {
            'google.id': profile.id
          };

      User.findOne( query, function( error, user )
      {
        if( user )
        {
          console.log( 'found' );
          done( null, user ); // нашли юзера в бд - отправляем объект юзера в сессию
        }
        else 
        {
          console.log( 'not found' );

          // если юзер не найден
          user = new User;

          user.email       = profile.emails[ 0 ].value;
          user.image       = profile._json.image.url;
          user.displayName = profile.displayName;

          user.google       = {};
          user.google.id    = profile.id;
          user.google.token = accessToken;
          
          user.save(); // сохранение в бд

          done( null, user ); // объект юзера в сессию
        }
      });
    }
  ) );
};
