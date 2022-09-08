<?php
namespace Grav\Plugin\Shortcodes;

use Thunder\Shortcode\Shortcode\ShortcodeInterface;

class RawShortcode extends Shortcode
{
    public function init()
    {
        $this->shortcode->getRawHandlers()->add('raw', function(ShortcodeInterface $sc)
        {
            return $sc->getContent();
        });
    }
}
