<?php
namespace Grav\Plugin\Shortcodes;

use Thunder\Shortcode\Shortcode\ShortcodeInterface;

class ContactShortcode extends Shortcode
{
    public function init()
    {
        $this->shortcode->getHandlers()->add('contact', function(ShortcodeInterface $sc) {
            if ( isset( $this->grav['config']['details'] ) )
            {
                $output = $this->twig->processTemplate('shortcodes/contact.html.twig' );
                return $output;
            }
            return '';
        });
    }
}