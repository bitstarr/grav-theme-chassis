(function(win, doc) {
    'use strict';

    if ( doc.querySelectorAll( '.visualizer button.playpause + audio' ) )
    {
        let buttons = doc.querySelectorAll( '.visualizer button.playpause' );

        buttons.forEach( function( button )
        {
            button.refPlayer = doc.querySelector( 'audio[data-audioid="' + button.dataset.audioid + '"]' );
            button.addEventListener( 'click', function( e )
            {
                let refPlayer = e.target.refPlayer;

                if ( refPlayer.paused )
                {
                    refPlayer.play();
                    button.classList.remove( 'is-paused' );
                    button.classList.add( 'is-playing' );
                }
                else
                {
                    refPlayer.pause();
                    button.classList.remove( 'is-playing' );
                    button.classList.add( 'is-paused' );
                }
            });
            button.refPlayer.addEventListener( 'ended', function( player )
            {
                let button = doc.querySelector( 'button[data-audioid="' + player.target.dataset.audioid + '"]' );
                button.classList.remove( 'is-playing' );
                button.classList.add( 'is-paused' );
            });
        });
    }

})(window, document);
