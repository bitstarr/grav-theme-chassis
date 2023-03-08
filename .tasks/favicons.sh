#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# my own realfavicongenerator with black jack and hookers!
# requires Image Magick
# @see https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs

# you can insert the following in your HTML, but you don't need to
# if you put the files in your web root anyway
# <link rel="icon" href="/favicon.ico" sizes="any">
# <link rel="icon" href="/icon.svg" type="image/svg+xml">
# <link rel="apple-touch-icon" href="/apple-touch-icon.png">

if [ -z "$1" ] || [ -z "$2" ]
  then
    echo "${RED}Please provide input and output folders as arguments.${NC}\n"
    exit
fi

printf "${MAGENTA}Creating Favicons${NC}\n"

mkdir -p "$2"

convert -background none "$1/favicon.svg" -define icon:auto-resize=32,16 -alpha off -colors 128 "$2/favicon.ico"

convert -background none -resize 512x512 "$1/favicon.svg" "$2/favicon-512.png"
convert -background none -resize 192x192 "$1/favicon.svg" "$2/favicon-192.png"
convert -background none -resize 140x140 -gravity center -extent 180x180 "$1/favicon.svg" "$2/apple-touch-icon.png"

cp "$1/favicon.svg" "$2/favicon.svg"
cp "$1/site.webmanifest" "$2/site.webmanifest"

printf "${GREEN}Favicons Created${NC}\n"

npm run faviconsmin