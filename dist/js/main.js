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