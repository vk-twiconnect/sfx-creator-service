zip -r $1/target/sfx.zip $1/src && \
    cat ./unzipsfx-552_win32/unzipsfx.exe $1/target/sfx.zip > $1/target/sfx.exe && \
    zip -A $1/target/sfx.exe
    