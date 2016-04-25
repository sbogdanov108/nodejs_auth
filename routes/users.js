var express = require( 'express' );

var router  = express.Router(),
    facebook = require( '../services/facebook' )( 'KEY', 'KEY' ),
    twitter = require( '../services/twitter' )( 'KEY', 'KEY' );

router.use( '/', function( req, res, next )
{
  // если passport не добавил объект юзера к запросу
  if( !req.user )
    res.redirect( '/' );

  next();
});

router.use( '/', function( req, res, next )
{
  twitter.getUserTimeLine( req.user.twitter.token, req.user.twitter.tokenSecret, req.user.twitter.id, function( results )
  {
    if( !results.errors )
      req.user.twitter.lastPost = results[ 0 ].text;

    next();
  });
});

// /users
router.get( '/', function( req, res )
{
  if( req.user.facebook ) // если юзер под фейсбуком
  {
    facebook.getImage( req.user.facebook.token, function( imageUrl )
    {
      req.user.facebook.image = imageUrl; // добавляем к объекту юзера изображение

      facebook.getFriends( req.user.facebook.token, function( results )
      {
        req.user.facebook.friends = results.total_count;

        res.render( 'users', {
          user: req.user// берем из запроса, в который помещается объект юзера
        } );
      });
    } );
  }
  else
  {
    res.render( 'users', {
      user: req.user // берем из запроса, в который помещается объект юзера из google.strategy
    } );
  }
} );

module.exports = router;
