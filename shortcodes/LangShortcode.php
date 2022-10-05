<?php
namespace Grav\Plugin\Shortcodes;

use Grav\Common\Language\Language;
use Thunder\Shortcode\Shortcode\ShortcodeInterface;

class LangShortcode extends Shortcode
{

    public function init()
    {
        $this->shortcode->getHandlers()->add('lang', function(ShortcodeInterface $sc) {
            $lang = $this->getBbCode($sc);
            $inline = $sc->getParameter('inline') || null;

            if ( $lang && !$inline )
            {
                $output = '<div class="textflow" lang="' . $lang . '">';
                $output .= $sc->getContent();
                $output .= '</div>';
                return $output;
            }

            if ( $lang && $inline )
            {
                $output = '<span lang="' . $lang . '">';
                $output .= $sc->getContent();
                $output .= '</span>';
                return $output;
            }

            return $sc->getContent();;
        });
    }
}