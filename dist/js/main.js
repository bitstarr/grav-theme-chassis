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
                const isOpen = self.button.getAttribute( 'aria-expanded' ) === 'false';
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

                if ( self.button.getAttribute( 'aria-expanded' ) === 'false' ) {
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

(function() {
    const collapsibles = document.querySelectorAll( '.js-details' );
    Array.prototype.forEach.call(collapsibles, function(collapsible)
    {
        let btn = collapsible.querySelector( 'button' );
        collapsible.dataset['expanded'] = false;
        btn.setAttribute( 'aria-expanded', false );
        btn.onclick = function()
        {
            let expanded = btn.getAttribute( 'aria-expanded' ) === 'true';
            btn.setAttribute( 'aria-expanded', !expanded );
            collapsible.setAttribute( 'data-expanded', !expanded );
        };
    });
})();
(function () {
    function runTabs()
    {
        // Get relevant elements and collections
        const container = document.querySelector('.tabs');
        const tablist = container.querySelector('ul.tabs__head');
        const tabs = tablist.querySelectorAll('.tabs a.tabs__toggle');
        const panels = container.querySelectorAll('[id^="tabsection"]');

        // Useful for no-JS fallbacks
        container.classList.add( 'is-interactive' );

        // The tab switching function
        const switchTab = (oldTab, newTab) => {
            newTab.focus();
            // Make the active tab focusable by the user (Tab key)
            newTab.removeAttribute('tabindex');
            // Set the selected state
            newTab.setAttribute('aria-selected', 'true');
            oldTab.removeAttribute('aria-selected');
            oldTab.setAttribute('tabindex', '-1');
            // Get the indices of the new and old tabs to find the correct
            // tab panels to show and hide
            let index = Array.prototype.indexOf.call(tabs, newTab);
            let oldIndex = Array.prototype.indexOf.call(tabs, oldTab);
            panels[oldIndex].hidden = true;
            panels[index].hidden = false;
        };

        // Add the tablist role to the first <ul> in the .tabs container
        tablist.setAttribute('role', 'tablist');

        // Add semantics are remove user focusability for each tab
        Array.prototype.forEach.call(tabs, (tab, i) => {
            tab.setAttribute('role', 'tab');
            tab.setAttribute('id', 'tab' + (i + 1));
            tab.setAttribute('tabindex', '-1');
            tab.parentNode.setAttribute('role', 'presentation');

            // Handle clicking of tabs for mouse users
            tab.addEventListener('click', e => {
                e.preventDefault();
                let currentTab = tablist.querySelector('[aria-selected]');
                if (e.currentTarget !== currentTab) {
                    switchTab(currentTab, e.currentTarget);
                }
            });

            // Handle keydown events for keyboard users
            tab.addEventListener('keydown', e => {
                // Get the index of the current tab in the tabs node list
                let index = Array.prototype.indexOf.call(tabs, e.currentTarget);
                // Work out which key the user is pressing and
                // Calculate the new tab's index where appropriate
                let dir = e.which === 37 ? index - 1 : e.which === 39 ? index + 1 : e.which === 40 ? 'down' : null;
                if (dir !== null) {
                    e.preventDefault();
                    // If the down key is pressed, move focus to the open panel,
                    // otherwise switch to the adjacent tab
                    dir === 'down' ? panels[i].focus() : tabs[dir] ? switchTab(e.currentTarget, tabs[dir]) : void 0;
                }
            });
        });

        // Add tab panel semantics and hide them all
        Array.prototype.forEach.call(panels, (panel, i) => {
            panel.setAttribute('role', 'tabpanel');
            panel.setAttribute('tabindex', '-1');
            let id = panel.getAttribute('id');
            panel.setAttribute('aria-labelledby', tabs[i].id);
            panel.hidden = true;
        });

        // Initially activate the first tab and reveal the first tab panel
        tabs[0].removeAttribute('tabindex');
        tabs[0].setAttribute('aria-selected', 'true');
        panels[0].hidden = false;
    }

    if ( document.querySelector('.tabs') )
    {
        runTabs();
    }
})();