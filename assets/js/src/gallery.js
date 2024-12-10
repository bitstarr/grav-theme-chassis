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
                    const prvs = new Parvus({
                        hideScrollbar: false,
                        gallerySelector: self.selector,
                        selector: '.sc-gallery__link',
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
