var passport = require( 'passport' );

module.exports = function( app )
{
  app.use( passport.initialize() );
  app.use( passport.session() );

  passport.serializeUser( function( user, done )
  {
    done( null, user ); // объект юзера в сессию
  } );

  passport.deserializeUser( function( user, done )
  {
    done( null, user ); // из сессии в объект юзера
  } );
  
  require( './strategies/google.strategy' )();
  require( './strategies/twitter.strategy' )();
  require( './strategies/facebook.strategy' )();
};
