/*!
 * @copyright Copyright (c) 2013 Sebastian Laube
 * @license   Licensed under MIT license
 *            See https://github.com/bitstarr/ruleemall
 * @version   1.2.0
 */
(function( d, w )
{
    "use strict";

    /*
        We use 5em because with 1em the browser will round to full pixels.
        If body font size is 90% of 16px (16px = browser default) the correct 1em will be 14.4px.
        With 1em base measure in the .unit we will only get 14px.
    */

    var body = d.body,
        factor = 5;

    // add an example unit to get the base measure
    // add a display block
    var emMeter =  d.createElement( 'div' );
    emMeter.id = 'emMeter';
    emMeter.style.cssText = 'position:fixed;bottom:4rem;left:0;z-index:900';
    emMeter.innerHTML = '<div class="display" style="display:inline-block;padding:.4em;font-family:monospace;font-size:.9rem;line-height:1.3;color:#fff;background:#000;background:rgba(0,0,0,.6)">0</div><div class="unit" style="width:' + factor + 'rem;visibility:hidden;">0</div>';
    body.appendChild( emMeter );

    var unit  = emMeter.querySelector( '.unit' ),
        display  = emMeter.querySelector( '.display' ),
        width = unit.clientWidth/factor;

    // calculate how many em the window is wide and high
    function meter()
    {
        width = unit.clientWidth/factor;
        var viewWidth = w.innerWidth/width,
            viewHeight = w.innerHeight/width;
        // round 2 digits after comma
        viewWidth = Math.round( viewWidth*100 )/100;
        viewHeight = Math.round( viewHeight*100 )/100;

        display.innerHTML = 'W ' + viewWidth + 'em<br/>W ' + w.innerWidth + 'px<br/>H ' + viewHeight + 'em<br/>H ' + w.innerHeight + 'px';
    }
    meter();

    // do the dance on resize
    w.addEventListener( 'resize', meter, false );

})( document, window );