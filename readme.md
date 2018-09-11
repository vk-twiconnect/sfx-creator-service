# Self-Extractor Creator Service

## Overview

* A micro-service running to package a self-extracting zip file for Windows Platfrom
* Micro-service is running inside a linux docker container for portability reasons
* Node.js has been selected due to its asynchronous nature and a light foot print
* A side-car process it launched from micro-service to create the zip file: [unzipsfx](http://infozip.sourceforge.net/)

## End-Points

### Create Zip File

#### Request

```
curl -XPOST   -H "Content-Type: application/json" \
              -H "x-api-key: f84e2396-9c14-11e8-98d0-529269fb1459" \
              -d \
'
{
  "files": [
    {
      "path": "filename1.txt",
      "content": "ZmlsZS0xLWNvbnRlbnQ="
    },
    {
      "path": "folder1/filename1.txt",
      "content": "ZmlsZS0yLWNvbnRlbnQ="
    }
  ]
}
' 'localhost:3000/zip'
```

Or

```
curl -XPOST   -H "Content-Type: application/json" \
              -H "x-api-key: f84e2396-9c14-11e8-98d0-529269fb1459" \
              -d  "@./test/sampleData.json" 'localhost:3000/zip'
```


* Content is base64 encoded
* x-api-key is for authentication purposes

#### Response

{
  "archiveContent": "c2VmLWV4dHJhY3Rvci1jb250ZW50"
}

* Content is base64 encoded and needs to be saved with `exe` extension

## Development on CentOS

* Clone the repository
* Run the bash setup script: `chmod +x ./setup.sh && ./setup.sh`

## Build & Run

```
docker build . --tag twiconnect/sfx-creator-service:1.0 && \
  docker run -it -d -p 3000:3000 --rm --name sfx-creator-service twiconnect/sfx-creator-service:1.0
```

## Deployment Models

* `npm start` anywhere where Node.Js v9 runs
* Container hosting, [sample deployment on Heroku](https://sfx-creator-service-dev.herokuapp.com/)


PHP Client


<?PHP

//List the files to be included.  These must be in the current directory.
//The files may have anything in them, including binary data.
//
$list_of_files[] = "filename1.txt";
$list_of_files[] = "filename2.txt";
$list_of_files[] = "filename3.txt";
//
//
//
//prefix
$inp  = "{";
$inp .=     '"files": [';

//build json for each file
foreach($list_of_files as $key=>$one_file){
    if($key==count($list_of_files)-1){
          $sep = "";
        }else{
          $sep = ", ";
        }
$inp .=       ' {';
$inp .=       ' "path": "' . $one_file . '",';
$inp .=       ' "content": "' . base64_encode(file_get_contents($one_file)) . '"';
$inp .=       ' }' . $sep ;
}//foreach
//json wrapper
$inp .=      ']';
$inp .= "}";

   $cmd = 'curl -XPOST   -H "Content-Type: application/json" -H "x-api-key: f84e2396-9c14-11e8-98d0-529269fb1459" -d ' . "'" .  $inp . "'" . '  74.88.134.103:3000/zip 2> /dev/null ';

    $out2=exec($cmd, $out1);
//print ($out2); //out2 is pure json
    $purejson = json_decode($out2);
    $archiveContent = $purejson->archiveContent;
//print($archiveContent);
    $raw = base64_decode($archiveContent);
//this output is a .exe file
    print($raw);
?>
