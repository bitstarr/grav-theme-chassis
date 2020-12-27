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

            self.overlayToggles = doc.querySelectorAll( '#navigation__state' );
            self.overlayToggles.forEach( function( toggle )
            {
                toggle.addEventListener( 'change', function()
                {
                    win.project.toggleBodyScroll();
                });
            });
        },

        toggleBodyScroll: function()
        {
            let self = this,
                scrolling = true;

            self.overlayToggles.forEach( function( toggle )
            {
                if ( toggle.checked )
                {
                    scrolling = false;
                    return;
                }
            });

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
