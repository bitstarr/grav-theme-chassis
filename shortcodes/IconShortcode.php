<?php
namespace Grav\Plugin\Shortcodes;

use Thunder\Shortcode\Shortcode\ShortcodeInterface;

class IconShortcode extends Shortcode
{
    public function init()
    {
        $this->shortcode->getHandlers()->add('icon', function(ShortcodeInterface $sc)
        {
            if ( $this->grav['config']->get('plugins.svg-extension.enabled') )
            {
                $icon = $sc->getParameter('icon', $this->getBbCode($sc));
                $id = $sc->getParameter('id');
                $class = $sc->getParameter('class');
                $title = $sc->getParameter('title');

                if ( $icon )
                {
                    $svgExt = $this->grav['plugins']->getPlugin('svg-extension');
                    $class = 'icon ' . $class;
                    $output = $svgExt->getSvg(
                        $icon,
                        $class,
                        [
                            'id' => $id,
                            'title' => $title,
                        ],
                    );
                    return $output;
                }
            }
        });
    }
}
