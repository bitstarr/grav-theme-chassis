<?php
namespace Grav\Theme\Chassis;

use Grav\Common\Grav;
use Grav\Common\Filesystem\Folder;

class Utils
{
    function hexToRGB($hex)
    {
        list($r, $g, $b) = sscanf($hex, "#%02x%02x%02x");
        return [$r, $g, $b];
        // {{ chassis.hexToRGB('#ffffff') }
    }

    function preloadFonts()
    {
        $grav = Grav::instance();
        $path = $grav['locator']->findResources('theme://dist/fonts/', false );
        $files = Folder::all( $path[0] );
        $links = '';

        foreach( $files as $file )
        {
            if ( preg_match( "/^.*\.(woff|woff2)$/i", $file, $ext ) )
            {
                $url = $path[0] . '/' . $file;
                $links .= '<link rel="preload" href="/' . $url . '" as="font" type="font/' . $ext[1] . '" crossorigin />'. "\n";
            }
        }

        echo $links;
    }
}