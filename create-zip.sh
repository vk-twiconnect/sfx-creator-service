#!/bin/sh
cd $1/src && \
zip -r ../target/sfx.zip ./ && \
    cat ../../unzipsfx-552_win32/unzipsfx.exe ../target/sfx.zip > ../target/sfx.exe && \
    zip -A ../target/sfx.exe
    