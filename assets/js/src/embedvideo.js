(function(win, doc) {
    'use strict';

    /* Basic Object
    --------------------------------------------------- */
    win.project = win.project || {};

    win.project.embedvideo = {

        selector: 'iframe[data-src]',

        init: function()
        {
            let self = this;
            self.frames = doc.querySelectorAll( win.project.embedvideo.selector );
            self.message = '<p>' + self.frames[0].dataset.privacy + '</p><p class="buttons"><button class="button" data-action="show_embedded_content">' + self.frames[0].dataset.once + '</button><button class="button" data-action="show_embedded_content_always">' + self.frames[0].dataset.always + '</button></p>';

            // did we get the permission already?
            if ( win.localStorage.getItem( 'allow_embed' ) )
            {
                self.startAllFrames();
            }
            else
            {
                self.showMessage();
            }
        },

        showMessage: function()
        {
            let self = this;

            // show mesasge for every iframe, create element after iframe
            self.frames.forEach( function( frame )
            {
                var message = doc.createElement( 'div' );
                message.classList.add( 'embedvideo__privacy' );
                message.innerHTML = self.message;
                message.querySelector( 'button[data-action="show_embedded_content"]' ).addEventListener( 'click', self.enableEmbed );
                message.querySelector( 'button[data-action="show_embedded_content_always"]' ).addEventListener( 'click', self.enableAllEmbeds );
                frame.insertAdjacentElement( 'afterend', message );
            });
        },

        enableEmbed: function( event )
        {
            let self = win.project.embedvideo;
            // get message contianer and ifrmae
            var message = event.target.parentNode.parentNode,
                frame = message.previousElementSibling;
            // set correct src for iframe
            frame.src = frame.dataset.src;
            // remove message
            message.remove();
        },

        enableAllEmbeds: function()
        {
            let self = win.project.embedvideo;
            // remember the decision
            win.localStorage.setItem( 'allow_embed', true );
            // go for every iframe
            self.frames.forEach( function( frame )
            {
                // remove message
                frame.nextElementSibling.remove();
            });

            self.startAllFrames();
        },

        startAllFrames: function()
        {
            let self = win.project.embedvideo;
            // go for every iframe
            self.frames.forEach( function( frame )
            {
                // set correct src for iframe
                frame.src = frame.dataset.src;
            });
        },
    };

    if ( doc.querySelector( win.project.embedvideo.selector ) )
    {
        win.project.embedvideo.init();
    }

})(window, document);
