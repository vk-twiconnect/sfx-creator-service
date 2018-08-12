$folderName=$1
zip -r ./$folderName/target/sfx.zip ./$folderName/src && \
    cat ./unzipsfx-552_win32/unzipsfx.exe ./$folderName/target/sfx.zip > ./$folderName/target/sfx.exe && \
    zip -A ./$folderName/target/sfx.exe
    