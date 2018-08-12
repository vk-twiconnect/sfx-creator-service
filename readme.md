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
      "content": "ZmlsZS0xLWNvbnRlbnQ=""
    },
    {
      "path": "folder1/filename1.txt",
      "content": "ZmlsZS0yLWNvbnRlbnQ="
    }
  ]
}
' \
          'https://host-name'
```

* Content is base64 encoded
* x-api-key is for authentication purposes

#### Response

{
  "archiveContent": "c2VmLWV4dHJhY3Rvci1jb250ZW50"
}

* Content is base64 encoded and needs to be saved with `exe` extension

## Development

* Clone the repository
* Run the bash setup script: `chmod +x ./setup.sh && ./setup.sh`


A test harness is here:
http://74.88.134.103:6002/test_microservice.htm
