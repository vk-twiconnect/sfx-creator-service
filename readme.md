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
docker build . --tag twiconnect/sfx-creator-service:1.0 &&
docker run -it -d -p 3000:3000 --rm --name sfx-creator-service twiconnect/sfx-creator-service:1.0
```

## Deployment Models

## Installing node on CentOS

* Install distribution version: `sudo yum install node -y`
* Install nvm: `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash`
* Refresh environment variables: `source ~/.bashrc`
* Install version 9: `nvm install 9`
* Set default version: `nvm alias default 9`
* Verify node version: `nvm --version`

### Local

* `npm start` anywhere where Node.Js v9 runs
* Container hosting, [sample deployment on Heroku](https://sfx-creator-service-dev.herokuapp.com/)

### Docker

* Build docker image
* Run a container from the newly created image

### AWS

* Run `npm install`
* Configure credentials: `./node_modules/serverless/bin/serverless config credentials --provider aws --key AWSKEY --secret AWSKEYPASSWORD`
* Deploy: `./node_modules/serverless/bin/serverless deploy --stage stage --region us-east-2`
* To test deployed end-point (replace the end-ponit):
```
curl -XPOST   -H "Content-Type: application/json" \
              -H "x-api-key: f84e2396-9c14-11e8-98d0-529269fb1459" \
              -d  "@./test/sampleData.json" 'https://qnwzp7kmtj.execute-api.us-east-2.amazonaws.com/stage/zip'
```
* Destroy: `./node_modules/serverless/bin/serverless destroy --stage stage --region us-east-2`
