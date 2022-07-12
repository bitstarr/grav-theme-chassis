<?php
namespace Grav\Plugin\Shortcodes;

use Thunder\Shortcode\Shortcode\ShortcodeInterface;

class EmailShortcode extends Shortcode
{
    public function init()
    {
        $this->shortcode->getHandlers()->add('email', function(ShortcodeInterface $sc)
        {
            $link = $sc->getParameter('link');
            $output = $this->twig->processString( '{{"' . $sc->getContent() . '"|safe_email}}' );
            if ( $link )
            {
                $output = '<a href="mailto:' . $output . '">' . $output . '</a>';
            }
            return $output;
        });
    }
}
