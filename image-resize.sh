#!/bin/bash

SRC_DIR="assets/img/downloaded"
DEST_DIR_1024="assets/img/1024"
DEST_DIR_512="assets/img/512"
DEST_DIR_256="assets/img/256"

if [ ! -d "$DEST_DIR_1024" ]; then
    echo "Creating destination directory: $DEST_DIR_1024"
    mkdir -p "$DEST_DIR_1024"
fi

if [ ! -d "$DEST_DIR_512" ]; then
    echo "Creating destination directory: $DEST_DIR_512"
    mkdir -p "$DEST_DIR_512"
fi

if [ ! -d "$DEST_DIR_256" ]; then
    echo "Creating destination directory: $DEST_DIR_256"
    mkdir -p "$DEST_DIR_256"
fi

for img in "$SRC_DIR"/*; do
    filename=$(basename "$img")
    echo "Resizing $filename"
    magick "$img" -resize 1024x "$DEST_DIR_1024/$filename"
done

for img in "$SRC_DIR"/*; do
    filename=$(basename "$img")
    echo "Resizing $filename"
    magick "$img" -resize 512x "$DEST_DIR_512/$filename"
done

for img in "$SRC_DIR"/*; do
    filename=$(basename "$img")
    echo "Resizing $filename"
    magick "$img" -resize 256x "$DEST_DIR_256/$filename"
done

echo "Resizing completed."
