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

        if ( !$path )
        {
            return;
        }

        $files = Folder::all( $path[0] );
        $links = '';

        foreach( $files as $file )
        {
            if ( preg_match( "/^.*\.(woff|woff2)$/i", $file, $ext ) )
            {
                $url = $path[0] . '/' . $file;
                $links .= '<link rel="preload" href="/' . $url . '" as="font" type="font/' . $ext[1] . '" crossorigin>'. "\n";
            }
        }

        echo $links;
    }

    public static function getIcons()
    {
        $grav = Grav::instance();
        $path = $grav['locator']->findResources('theme://dist/icons/', false );

        if ( !$path )
        {
            return;
        }

        $files = Folder::all( $path[0] );
        $icons = [];

        foreach( $files as $file )
        {
            if ( preg_match( "/^.*\.(svg)$/i", $file, $ext ) )
            {
                $name = pathinfo( $path[0] . '/' . $file, PATHINFO_FILENAME );
                if ( strstr( $name, 'logo' ) )
                {
                    continue;
                }
                $icons[ $name ] = $name;
            }
        }

        ksort( $icons );

        return $icons;
    }

    public static function phoneNumberCleanUp( $input )
    {
        $output = preg_replace( '~\s|-|\/|\(.*\)|\.~', '', $input );
        return $output;
    }
}