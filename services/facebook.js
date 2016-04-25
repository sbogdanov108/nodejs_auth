/**
 * Created by sb on 24.04.2016.
 */

var OAuth = require( 'oauth' ).OAuth2;

var Facebook = function( facebookKey, facebookSecret )
{
  var key = facebookKey,
      secret = facebookSecret;

  var oauth = new OAuth( key, secret,
    'https://graph.facebook.com',
    null,
    'oauth2/token',
    null
  );

  var getImage = function( userKey, done )
  {
    // обращение к API Facebook
    oauth.get( 'https://graph.facebook.com/v2.3/me/picture?redirect=false&type=large', userKey, function( err, results, res )
    {
      results = JSON.parse( results ); // ответ

      done( results.data.url );
    } );
  };

  var getFriends = function( userKey, done )
  {
    // обращение к API Facebook
    oauth.get( 'https://graph.facebook.com/v2.3/me/friends?redirect=false', userKey, function( err, results, res )
    {
      results = JSON.parse( results ); // ответ

      done( results.summary );
    } );
  };

  return {
    getImage: getImage,
    getFriends: getFriends
  }
};

module.exports = Facebook;