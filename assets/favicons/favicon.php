<?php
    header('Content-Type: image/svg+xml');
    $path = '//' . $_SERVER['HTTP_HOST'] . dirname($_SERVER['SCRIPT_NAME']);
    $letter = ( isset( $_GET['letter'] ) ) ? strtoupper( substr( $_GET['letter'], 0, 3 ) ) : ucfirst($_SERVER['HTTP_HOST'])[0];
?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#111">
    <style>
        svg {
            --fg: #000000;
            --bg: #ffffff;
        }
        .letter {
            font: bold 250px sans-serif;
        }
        .letter-1,
        .letter-2 {
            letter-spacing: .1em;
            font-stretch: condensed;
        }
        .letter-1 {
            font-size: 350px;
        }
        .letter-2 {
            font-size: 300px;
        }
        .label {
            font: 800 condensed 170px/1 sans-serif;
        }
        @media (prefers-color-scheme: dark) {
            svg {
                --fg: #ffffff;
                --bg: #000000;
            }
        }
    </style>

    <?php /*
    <image x="0" y="0" width="512" height="512" href="<?php echo $path ?>/favicon.svg" />
    */ ?>
    <rect class="bg" width="512" height="512" fill="var( --bg )" />
    <text x="50%" y="35%" fill="var( --fg )" dominant-baseline="middle" text-anchor="middle" class="letter">
        <?php echo $letter ?>
    </text>
<?php
switch ( $_GET['env'] )
{
    case 'preview':
?>
    <rect x="0" y="312" width="512" height="200" fill="#46A0B2" />
    <text class="label" x="50%" y="84%" dominant-baseline="middle" text-anchor="middle">PRV</text>
<?php
        break;
    case 'stage':
?>
    <rect x="0" y="312" width="512" height="200" fill="#97B246" />
    <text class="label" x="50%" y="84%" dominant-baseline="middle" text-anchor="middle">STG</text>
<?php
        break;
    case 'dev':
    default:
?>
    <rect x="0" y="312" width="512" height="200" fill="#46B28F" />
    <text class="label" x="50%" y="84%" dominant-baseline="middle" text-anchor="middle">DEV</text>
    <?php
        break;
}
?>
</svg>