const express = require('express');
const router = express.Router();

require('dotenv').config();
var uniqid = require('uniqid');


var mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE+'://'+process.env.MONGO_HOST+':'+process.env.MONGO_PORT+'/'+process.env.MONGO_DB, {useNewUrlParser: true}).then(
  ()=>{
    console.log('Connnected to database!');
  }
).catch( ()=>{
    console.log('Mongodb connection failed!');
  }
);

var jobSchema = new mongoose.Schema({
  name: String,
  description: String,
  startTime: String,
  endTime: String,
  executionTime: Number,
  jobType: String,
  jobTicket: String,
  datasetSize: Number,
  objProcessed: Number,
  // plmCompletedCount: Number,
  processedCount: Number,
  iteration: Number,
  percentageProcessed: Number,
  validationPassed: Number,
  validationFailed: Number,
  complexity: String,
  status: String,
  hostname: String,
  environment: String
});

var Job = mongoose.model('Job', jobSchema);

// const dbTransaction = require("mongoose-transactions");
// const transaction = new dbTransaction();

function getComplexity(execTime){
    execTime = parseInt(execTime);
  
    if(execTime<=20)
      return "simple";
    else if(execTime > 20 && execTime <= 120)
      return "medium";
    else if(execTime > 120 && execTime <= 240)
      return "complex";
    else
      return "very complex";
  }

  function getExecTime(sTime,eTime){
    if(sTime == "" && eTime == ""){
      return 0;
    }
    var startDate = new Date(sTime);
    var endDate = new Date(eTime);
    var execTime = endDate-startDate;
    execTime = execTime/60000;
    execMin = Math.floor(execTime);
    execSec = Math.floor((execTime%1)*60);
    if(execSec == 0){
      execSec = "00";
    }
    return execMin;
  }

router.get('/fetchJobs', function(req, res){
    console.log("GET Called to fetch jobs");
    // console.log(req.query.jobTicket);
    var outcome = {};
    // var firstParam = {};
    // var fromDay = "";
    // var fromMonth = "";
    // var toDay = "";
    // var toMonth = "";
  
    // if(Math.floor(req.query.fromDay/10) == 0){
    //   fromDay = "0"+req.query.fromDay;
    // }else{
    //   fromDay = req.query.fromDay
    // }
    // if(Math.floor(req.query.fromMonth/10) == 0){
    //   fromMonth = "0"+req.query.fromMonth;
    // }else{
    //   fromMonth = req.query.fromMonth;
    // }
    // if(Math.floor(req.query.toDay/10) == 0){
    //   toDay = "0"+req.query.toDay;
    // }else{
    //   toDay = req.query.toDay;
    // }
    // if(Math.floor(req.query.toMonth/10) == 0){
    //   toMonth = "0"+req.query.toMonth;
    // }else{
    //   toMonth = req.query.toMonth;
    // }
    // // if(req.query.id){
    //   firstParam = {startTime:{"$gte": ""+fromMonth+"/"+fromDay+"/"+req.query.fromYear, "$lt": ""+toMonth+"/"+toDay+"/"+req.query.toYear}}
    // // }
    
    Job.find({}, function(err, jobs){
      if(err){
        console.log(err);
      }else{
        // console.log(jobs);
  
        outcome.data = jobs;
        outcome.message='OK'
        // console.log(""+fromMonth+"/"+fromDay+"/"+req.query.fromYear);
        // console.log(""+toMonth+"/"+toDay+"/"+req.query.toYear);
        // console.log(firstParam);
        res.status(200).json(outcome);
      }
    });
  
});

 function saveJob(req,res,itr) {

  try {
    
    var totalExecTime = getExecTime(req.body.startTime, req.body.endTime);
    var jobTicket = uniqid(req.body.name+'-');
    var objProcessed = 0;
    if(totalExecTime != 0){
      objProcessed = Math.floor((req.body.datasetSize / (totalExecTime)));
    }
    var percentageProcessed = ((req.body.processedCount / req.body.datasetSize) * 100).toFixed(1);
    var validationPassed = req.body.validationPassed;
    var validationFailed = 100 - validationPassed;
    var job = new Job({
      name: req.body.name, 
      description: req.body.description,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      executionTime: totalExecTime,
      jobType: req.body.jobType,
      jobTicket: jobTicket,
      datasetSize: req.body.datasetSize,
      objProcessed: objProcessed,
      processedCount: req.body.processedCount,
      iteration: req.body.iteration,
      percentageProcessed: percentageProcessed,
      validationPassed: validationPassed,
      validationFailed: validationFailed,
      complexity: getComplexity(totalExecTime),
      status: req.body.status,
      hostname: req.body.hostname,
      environment: req.body.environment
    });
    /*const jobID = transaction.insert('Job', job);
    console.log('job id ' + jobID);

    
    transaction.run();*/

    job.save(function(error){
      if(error)
      {
        console.log(error);
      }
      else{
        console.log('JOB saved successfully');
        res.status(201).json({Message: job.jobTicket});
      }
    })

   
  }
  catch(error){
    console.error(error);
    //transaction.clean();
  }
}

router.post('/createJob', function (req, res) {
    console.log(' POST CALLED');

    // Job.find({name: req.body.name}, function(err, jobs){
    //   // console.log(jobs);
    //   // console.log(jobs.length);
    //   if(jobs.length == 0){
    //     saveJob(req,res,1);
    //   }else{
    //     // var i = 0;
    //     // for(i in jobs){
    //     //   console.log("*****"+i);
    //     // }
    //     saveJob(req,res,jobs[jobs.length-1].iteration + 1);
    //     // var validationPassedAverage = (Number(req.body.validationPassed) + Number(jobs.validationPassed)) / 2;
    //     //   var validationFailedAverage = ((100 - Number(req.body.validationPassed)) + Number(jobs.validationFailed)) / 2;
    //     //   var updatedIteration = jobs.iteration + 1;
    //     //   var updatedDatasetSize = jobs.datasetSize + Number(req.body.datasetSize);
    //     //   Job.updateOne({name: req.body.name}, {$set:{iteration: updatedIteration, validationPassed: validationPassedAverage, validationFailed: validationFailedAverage, datasetSize: updatedDatasetSize}}, {upsert: true}, function(err){
    //     //     if(err)
    //     //       console.log(err);
    //     //     else
    //     //       console.log("Update Successful!");
    //     //       res.status(200).json({UpdatedJOB: jobs});
    //     //   });
        
    //   }
    // });
    saveJob(req,res);
});

router.post('/api/addBulkJobs', function(req,res){
    (req.body).forEach(function(currentJob){
      var totalExecTime = getExecTime(currentJob.startTime, currentJob.endTime);
      var jobTicket = uniqid(currentJob.jobType+'-');
      var objProcessed = Math.floor((currentJob.datasetSize / (totalExecTime)));
      var percentageProcessed = ((currentJob.processedCount /currentJob.datasetSize) * 100).toFixed(1);
      var validationPassed = currentJob.validationPassed;
      var validationFailed = 100 - validationPassed;
      var job = new Job({
        name: currentJob.name, 
        description: currentJob.description,
        startTime: currentJob.startTime,
        endTime: currentJob.endTime,
        executionTime: totalExecTime,
        jobType: currentJob.jobType,
        jobTicket: jobTicket,
        datasetSize: currentJob.datasetSize,
        objProcessed: objProcessed,
        processedCount: currentJob.processedCount,
        iteration: currentJob.iteration,
        percentageProcessed: percentageProcessed,
        validationPassed: validationPassed,
        validationFailed: validationFailed,
        complexity: getComplexity(totalExecTime),
        status: currentJob.status,
        hostname: currentJob.hostname,
        environment: currentJob.environment
      });
      var jobId;
      job.save(function(error, jobObj){
        jobId = jobObj._id;
        if(error){
          console.log(error);
        }else{
          console.log("Job saved successfuly");
          // res.status(200).json({ObjectId: jobId});
        }
      });
    });
    res.status(201).json({"message":"Success"});
});

router.put('/:jobTicket', function(req, res){
    console.log("PUT Called");
    Job.findOne({jobTicket: req.params.jobTicket}, function(err, jobs){
      if(err){
        console.log(err);
      }else{
  
        var totalExecTime = getExecTime(jobs.startTime, req.body.endTime);
        var objProcessed = Math.floor((req.body.datasetSize / (totalExecTime)));
        var percentageProcessed = ((req.body.processedCount / req.body.datasetSize) * 100).toFixed(1);
        var validationPassed = req.body.validationPassed;
        var validationFailed = 100 - validationPassed;
  
        Job.updateOne({jobTicket: req.params.jobTicket}, {$set:{endTime: req.body[itr].endTime, executionTime: totalExecTime, complexity: getComplexity(totalExecTime), status: req.body[itr].status, objProcessed: objProcessed, percentageProcessed: percentageProcessed, validationPassed: validationPassed, validationFailed: validationFailed}}, {upsert: true}, function(err){
          if(err)
            console.log(err);
          else
            console.log("Update Successful!");
        });
      }
    });
  
    Job.findOne({jobTicket: req.params.jobTicket}, function(err, jobs){
      if(err){
        console.log(err);
      }else{
        // console.log(jobs);
        res.status(200).json({UpdatedJOB: jobs});
      }
    });
});

router.put('/api/bulkUpdateJobs', function(req,res){
    console.log("Bulk Job Update Called!");
    // console.log(req.body);
    (req.body).forEach(function(currentJob){
      Job.findOne({jobTicket: currentJob.jobTicket}, function(err, jobs){
        if(err){
          console.log(err);
        }else{
          try{
          var totalExecTime = getExecTime(jobs.startTime, currentJob.endTime);
          }catch(e){
            console.log(e+" Job Does not exist!");
          }
          console.log("Total Execution Time +++++"+totalExecTime);
          var objProcessed = Math.floor((currentJob.datasetSize / (totalExecTime)));
          // console.log("+++"+objProcessed);     
          var percentageProcessed = ((currentJob.processedCount / currentJob.datasetSize) * 100).toFixed(1);
          var validationPassed = currentJob.validationPassed;
          var validationFailed = 100 - validationPassed;
          Job.updateOne({jobTicket: currentJob.jobTicket}, {$set:{endTime: currentJob.endTime, executionTime: totalExecTime, complexity: getComplexity(totalExecTime), status: currentJob.status, objProcessed: objProcessed, percentageProcessed: percentageProcessed, validationPassed: validationPassed, validationFailed: validationFailed}}, {upsert: true}, function(err){
            if(err)
              console.log(err);
            else
              console.log(currentJob.jobTicket+" Update Successful!");
          });
        }
      });
    });
    res.status(200).json({UpdatedJOB: "Successful"});
});

router.delete('/:jobTicket', function(req, res){
    Job.remove({jobTicket: req.params.jobTicket}, function(err){
      if(err){
        console.log("Del Err: "+err);
        res.status(200).json({ERROR: err});
      }
      else{
        console.log("Deletion Successfuly!");
        res.status(200).json({DeletedJOB: req.params.id});
      }
    });
});

module.exports = {router,Job};  
