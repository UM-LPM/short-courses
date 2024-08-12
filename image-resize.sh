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

resize_image() {
    local img="$1"
    local dest_dir="$2"
    local size="$3"
    local filename=$(basename "$img")
    local dest_path="$dest_dir/$filename"

    if [ ! -f "$dest_path" ]; then
        echo "Resizing $filename to $size"
        magick "$img" -resize "${size}x" "$dest_path"
    else
        echo "$filename already exists in $dest_dir, skipping resize."
    fi
}

for img in "$SRC_DIR"/*; do
    resize_image "$img" "$DEST_DIR_1024" 1024
done

for img in "$SRC_DIR"/*; do
    resize_image "$img" "$DEST_DIR_512" 512
done

for img in "$SRC_DIR"/*; do
    resize_image "$img" "$DEST_DIR_256" 256
done

echo "Resizing completed."