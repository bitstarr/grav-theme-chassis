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
