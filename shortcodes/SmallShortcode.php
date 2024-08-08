<?php
namespace Grav\Plugin\Shortcodes;

use Thunder\Shortcode\Shortcode\ShortcodeInterface;

class SmallShortcode extends Shortcode
{
    public function init()
    {
        $this->shortcode->getHandlers()->add('small', function(ShortcodeInterface $sc) {
            $muted = $sc->getParameter('muted') || null;

            $css_class = ( $muted ) ? ' class="u-muted"' : '';

            $content = $sc->getContent();

            return "<small{$css_class}>{$content}</small>";
        });
    }
}
