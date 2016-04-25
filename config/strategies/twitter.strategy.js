/**
 * Created by sb on 17.04.2016.
 */

var passport       = require( 'passport' ),
    TwitterStrategy = require( 'passport-twitter' ).Strategy,
    User = require( '../../models/userModel' );

module.exports = function()
{passport.use( new TwitterStrategy(
    {
      consumerKey: 'KEY',
      consumerSecret: 'KEY',
      callbackURL: 'http://localhost:3000/auth/twitter/callback',
      passReqToCallback: true
    },
    function( req, token, tokenSecret, profile, done )
    {
      /*
      * Добавление в один объект нескольких видов авторизации и сохранение в бд
      * */
      if( req.user ) // юзер уже залогинен
      {
        var query = {};

        // юзер залогинен из гугла
        if( req.user.google )
        {
          console.log( 'google' );

          query = {
            'google.id': req.user.google.id
          };
        }
        else if( req.user.facebook ) // юзер залогинен из под фасебука
        {
          console.log( 'facebook' );

          query = {
            'facebook.id': req.user.facebook.id
          };
        }

        User.findOne( query, function( error, user ) // ищем юзера в бд
        {
          // и к существующему объекту добавляем новый
          user.twitter       = {};
          user.twitter.id    = profile.id;
          user.twitter.token = token;
          user.twitter.tokenSecret = tokenSecret;

          user.save(); // сохранение в бд

          done( null, user ); // объект юзера в сессию
        });
      }
      else
      {
        var user  = {},
            query = {
              'twitter.id': profile.id
            };

        User.findOne( query, function( error, user ) // поиск юзера в бд
        {
          if( user ) // юзер есть в бд
          {
            console.log( 'found' );

            done( null, user );
          }
          else // если юзер не найден
          {
            console.log( 'not found' );
            
            user = new User; // создаем нового юзера

            user.image       = profile._json.profile_image_url;
            user.displayName = profile.displayName;

            user.twitter       = {};
            user.twitter.id    = profile.id;
            user.twitter.token = token;
            user.twitter.tokenSecret = tokenSecret;

            user.save(); // сохранение в бд

            done( null, user ); // объект юзера в сессию
          }
        } );
      }
    }
  ));
};