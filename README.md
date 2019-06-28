# CockPit
CockPit provide real time monitoring of jobs, progress, file status and object status.
It provides additional benefit of uploading the assessment of the source data to the cockpit server using REST APIs

## Pre-requisites and System Requirements

Please ensure that you have the following installations
1. Java (JDK 8)
2. NodeJS (Latest LTS Version: 10.15.3 (includes npm 6.4.1))
3. Mongodb 64 bit 3.4.3 (mongodb-win32-x86_64-2008plus-ssl-3.4.3-signed.msi)


## Cockpit Configuration
Please modify the configuration properties as per your installations (.env file)

MONGO_DB=your mongo database, typical value by default is 'local' without quotes

Cockpit server port

PORT=3001

Machine running mongo db

MONGO_HOST=localhost

Mongo db PORT

MONGO_PORT=27017

Mongo db protocol, don't change

DATABASE=mongodb


## Deployment
Create a folder Cockpit and Clone or download the distribution to that folder,

Open CMD and cd to src\app

then run the command "npm install" this will take 5-10 minutes to install all the dependency files.

Then run the command "ng build --watch" to let the application do continuous building. (It will show six chunks rendered which means it has done the build. It will still be running let it be if you are still doing further development).

Then Run the command from the directory CockPit
"node app.js" This will start the server up and running.


## Verification
Hit the URL
http://cockpitserverhostname:3001
"cockpitserverhostname" is the hostname of the machine running the cockpit server.
And 3001 is the cockpit server port that we have specified in the .env file.

A successful deployment will show the Cockpit Server Welcome page.
