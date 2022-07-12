(function(win, doc) {
    'use strict';

    win.project = win.project || {};

    win.project.scGallery = {
        selector: '.sc-gallery',

        init: function()
        {
            let self = this;
            self.galleries = doc.querySelectorAll( self.selector );

            if ( self.galleries )
            {
                self.galleries.forEach( function( gallery )
                {
                    Chocolat( gallery.querySelectorAll( 'a' ), {
                        loop: true,
                        fullScreen: false,
                    });
                });
            }

        },
    };

    if ( doc.querySelectorAll( win.project.scGallery.selector ) )
    {
        win.project.scGallery.init();
    }

})(window, document);
