(function(win, doc) {
    'use strict';

    /* Basic Object
    --------------------------------------------------- */
    win.project = win.project || {};

    win.project = {
        doc: doc,
        body: doc.body,
        win: win,

        init: function()
        {
            let self = this;

            /*
                navigation enhancements
                see https://web.dev/building-a-sidenav-component/
            */

            // Press escape to close
            const layer = doc.querySelector( '#navigation' );
            layer.addEventListener( 'keyup', function( event )
            {
                if ( event.code === 'Escape' ) doc.location.hash = '';
            });

            // focus UX (improve small screen nav)
            layer.addEventListener('transitionend', function( e )
            {
                const isOpen = doc.location.hash === '#navigation';
                isOpen
                    ? doc.querySelector( '#nav-close' ).focus()
                    : doc.querySelector( '#nav-open' ).focus();
            });
        },

        toggleBodyScroll: function( scrolling = true )
        {
            let self = this;

            if ( scrolling )
            {
                doc.documentElement.classList.remove( 'noscroll' );
            }
            else
            {
                doc.documentElement.classList.add( 'noscroll' );
            }
        },
    };

    win.project.init();

})(window, document);
