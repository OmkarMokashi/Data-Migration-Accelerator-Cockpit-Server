# CockPit
CockPit provide real time monitoring of jobs, progress, file status and object status.
It provides additional benefit of uploading the assessment of the source data to the cockpit server using REST APIs

## Pre-requisites and System Requirements

Please ensure that you have the following installations
1. Java (JDK 8)
2. NodeJS (Latest LTS Version: 10.15.3 (includes npm 6.4.1))
3. Mongodb 64 bit 3.4.3 (mongodb-win32-x86_64-2008plus-ssl-3.4.3-signed.msi)


## Cockpit Configuration
Please modify the configuration properties as per your installations

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
Unzip the distribution file, and change directory to DataMigrationAccelerator\CockPit
Run the command from the directory DataMigrationAccelerator\CockPit
node app.js


## Verification
Hit the URL
http://cockpitserverhostname:3001
cockpitserverhostname is the hostname of the machine running the cockpit server.

A successful deployment will show the Cockpit Server Welcome page.
