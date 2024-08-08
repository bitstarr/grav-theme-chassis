<?php
/*
    [video=Uuad8V5f_QA]
    [video="https://www.youtube.com/watch?v=Uuad8V5f_QA"]
    [video id=Uuad8V5f_QA]
    [video id="https://www.youtube.com/watch?v=Uuad8V5f_QA"]
    [video id=141358 type=vimeo]
*/
namespace Grav\Plugin\Shortcodes;

use Thunder\Shortcode\Shortcode\ShortcodeInterface;

class VideoShortcode extends Shortcode
{
    const YOUTUBE_REGEX = '/(?:https?:\/{2}(?:(?:www.youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=))|(?:youtu\.be\/)))([a-zA-Z0-9_-]{11})/';

    const VIMEO_REGEX = '/https:\/\/(?:www.)?vimeo.com\/([0-9]{9})/';

    public function init()
    {
        $this->shortcode->getHandlers()->add('video', function(ShortcodeInterface $sc)
        {
            $options = [
                'id' => $sc->getParameter( 'id', $this->getBbCode($sc) ),
                'type' => $sc->getParameter( 'type' ) ?: 'youtube',
                'controls' => ( $sc->getParameter( 'controls' ) == '0' ) ? 0 : 1,
                'showinfo' => ( in_array( $sc->getParameter( 'showinfo' ), [ '0', null] ) ) ? 0 : 1,
                'color' => $sc->getParameter( 'color' ) ?: 'white',
                'class' => $sc->getParameter( 'class' ),
                'url' => null,
                'src' => $sc->getParameter( 'src', $this->getBbCode($sc) ),
                'poster' => $sc->getParameter( 'poster', $this->getBbCode($sc) ),
            ];

            if ( $options['id'] )
            {
                if ( preg_match( $this::YOUTUBE_REGEX, $options['id'], $match ) )
                {
                    $options['id'] = $match[1];
                    $options['type'] = 'youtube';
                }

                if ( preg_match( $this::VIMEO_REGEX, $options['id'], $match ) )
                {
                    $options['id'] = $match[1];
                    $options['type'] = 'vimeo';
                }
            }

            if ( $options['id'] && $options['type'] == 'youtube' )
            {
                $url = 'https://www.youtube-nocookie.com/embed/';
                $url .= $options['id'];
                $url .= '?modestbranding=1';
                $url .= '&rel=0';
                $url .= '&controls=' . $options['controls'];
                $url .= '&showinfo=' . $options['showinfo'];
                $url .= '&color=' . $options['color'];
                $options['url'] = $url;
                return $this::youtube( $options );
            }
            elseif ( $options['id'] && $options['type'] == 'vimeo' )
            {
                $url = 'https://player.vimeo.com/video/';
                $url .= $options['id'];
                $url .= '?title=' . $options['showinfo'];
                $url .= '&byline=' . $options['showinfo'];
                $url .= '&portrait=' . $options['showinfo'];
                $url .= '&color=' . $options['color'];
                $options['url'] = $url;
                return $this::vimeo( $options );
            }

            if ( $options['src'] )
            {
                return $this::local( $options );
            }
        });
    }

    private function youtube( $options ) {
        /** @var Twig $twig */
        $twig = $this->grav['twig'];

        $output = $twig->processTemplate( 'partials/sc-video-youtube.html.twig', $options );
        return $output;
    }

    private function vimeo( $options ) {
        /** @var Twig $twig */
        $twig = $this->grav['twig'];

        $output = $twig->processTemplate( 'partials/sc-video-vimeo.html.twig', $options );
        return $output;
    }

    private function local( $options ) {
        /** @var Twig $twig */
        $twig = $this->grav['twig'];
        $options['page'] = $this->grav['page'];

        $output = $twig->processTemplate( 'partials/sc-video-local.html.twig', $options );
        return $output;
    }
}
