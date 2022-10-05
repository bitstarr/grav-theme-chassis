<?php
namespace Grav\Plugin\Shortcodes;

use Grav\Common\Utils;
use Thunder\Shortcode\Shortcode\ShortcodeInterface;

class CaptionShortcode extends Shortcode
{
    public function init()
    {
        $this->shortcode->getHandlers()->add('caption', function(ShortcodeInterface $sc) {
            $id = $sc->getParameter('id');
            $class = $sc->getParameter('class');
            $caption = $sc->getParameter('caption');
            $page = $this->grav['page'];

            // Process any markdown on caption
            $caption = Utils::processMarkdown($caption, false, $page);

            $id_output = $id ? 'id="' . $id . '" ': '';
            $class_output = $class ? 'class="' . $class . '"' : '';
            $caption_output = $caption ? '<figcaption>' . $caption . '</figcaption>' : '';
            $content = strip_tags( $sc->getContent(), '<img><picture><video><audio><iframe><noscript><div>' );

            return '<figure ' . $id_output . ' ' . $class_output . '>' . $content . $caption_output . '</figure>';
        });
    }
}