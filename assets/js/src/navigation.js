(function (win, doc) {
    'use strict';

    win.project = win.project || {};

    win.project.navigation = {

        nav: doc.getElementById( 'mainnav' ),

        init: function () {
            let self = this;
            // self.subnavs = self.nav.querySelectorAll( '.submenu' );
            self.button = self.nav.querySelector( 'button.navigation__open' );
            self.abyss = self.nav.querySelector( 'span.navigation__abyss' );

            // toggle by menu button
            self.button.addEventListener( 'click', e => {
                const isOpen = self.button.getAttribute( 'aria-expanded' ) === "false";
                self.button.setAttribute( 'aria-expanded', isOpen );
                // self.nav.setAttribute( 'inert', isOpen );
            });

            // close on click on the abyss
            self.abyss.addEventListener( 'click', e => {
                self.button.setAttribute('aria-expanded', false);
                self.button.focus();
            });

            // close on ESC key
            self.nav.addEventListener( 'keyup', e => {
                if ( e.code === 'Escape' ) {
                    self.button.setAttribute('aria-expanded', false);
                    self.button.focus();
                }
            });

            self.trapFocus( self.nav );

            if ( self.nav.querySelectorAll( '.submenu' ) ) {
                self.initSubNav();
            }

        },

        trapFocus: function( element )
        {
            // @see https://hidde.blog/using-javascript-to-trap-focus-in-an-element/
            let self = this;
            let focusableEls = element.querySelectorAll('a[href]:not([disabled]):not(.is-fallback), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'),
                firstFocusableEl = focusableEls[0],
                lastFocusableEl = focusableEls[focusableEls.length - 1],
                KEYCODE_TAB = 9;

            element.addEventListener( 'keydown', function (e)
            {
                let isTabPressed = ( e.key === 'Tab' || e.keyCode === KEYCODE_TAB );

                if (!isTabPressed) {
                    return;
                }

                if ( self.button.getAttribute( 'aria-expanded' ) === "false" ) {
                    return;
                }

                if ( e.shiftKey )  /* shift + tab */
                {
                    if ( document.activeElement === firstFocusableEl )
                    {
                        lastFocusableEl.focus();
                        e.preventDefault();
                    }
                } else /* tab */
                {
                    if ( document.activeElement === lastFocusableEl )
                    {
                        firstFocusableEl.focus();
                        e.preventDefault();
                    }
                }
            });
        },

        initSubNav: function()
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
