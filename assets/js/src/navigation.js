(function(win, doc) {
    'use strict';

    win.project = win.project || {};

    win.project.navigation = {

        nav: doc.getElementById( 'navigation' ),

        init: function()
        {
            let self = this;
            self.subnavs = self.nav.querySelectorAll( '.submenu' );

            // loop all subnavs
            self.subnavs.forEach( function( subnav, index )
            {
                // give the link an ID
                if ( subnav.previousElementSibling.previousElementSibling.tagName === 'A' )
                {
                    subnav.previousElementSibling.previousElementSibling.id = 'SNlnk' + index;
                    subnav.id = 'SNtgt' + index;
                }
                else {
                    return;
                }
                // create the trigger
                var btn = subnav.previousElementSibling;
                btn.classList.add( 'menu__expander' );
                btn.id = 'SNbtn' + index;
                btn.setAttribute( 'aria-controls', 'SNtgt' + index );
                btn.setAttribute( 'aria-expanded', 'false' );
                btn.setAttribute( 'aria-hidden', 'false' );
                btn.removeAttribute( 'tabindex' );
                // use a string provided by markup (pre translated) for the label
                btn.setAttribute( 'aria-label', self.nav.dataset.l10nShow );
                btn.setAttribute( 'aria-labelledby', 'SNbtn' + index + ' ' + 'SNlnk' + index  );
                // add trigger before subnav
                subnav.insertAdjacentElement( 'beforebegin', btn );
                // add click event
                btn.addEventListener( 'click', function( event )
                {
                    let self = win.project.navigation;
                    self.toggleSubNav( event.target );
                });
            });
        },

        toggleSubNav: function( btn )
        {
            let parent = win.project.navigation,
                target = btn.nextElementSibling;

            // if clicked reference is hidden
            if ( btn.getAttribute( 'aria-expanded' ) === 'false' )
            {
                // hide all first
                parent.subnavs.forEach( function( subnav )
                {
                    var button = subnav.previousElementSibling;
                    button.setAttribute( 'aria-expanded', 'false' );
                    button.setAttribute( 'aria-label', parent.nav.dataset.l10nShow );
                    subnav.classList.remove( 'visible' );
                });

                // then show the referenced
                btn.setAttribute( 'aria-expanded', 'true' );
                btn.setAttribute( 'aria-label', parent.nav.dataset.l10nHide );
                target.classList.add( 'visible' );
            }
            else
            {
                // hide the referenced
                btn.setAttribute( 'aria-expanded', 'false' );
                btn.setAttribute( 'aria-label', parent.nav.dataset.l10nShow );
                target.classList.remove( 'visible' );
            }
        },
    };

    win.project.navigation.init();

})(window, document);
