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
            $str = $sc->getContent();

            // Encode email
            $output = '';
            $str_len = strlen($str);
            for ($i = 0; $i < $str_len; $i++) {
                $output .= '&#' . ord($str[$i]). ';';
            }

            if ( $link )
            {
                $output = '<a href="mailto:' . $output . '">' . $output . '</a>';
            }
            return $output;
        });
    }
}
