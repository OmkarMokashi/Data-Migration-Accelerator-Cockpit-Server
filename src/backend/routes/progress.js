const express = require('express');
const router = express.Router();

var jobArray = require('./jobs');
Job = jobArray.Job;

require('dotenv').config();

var mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE+'://'+process.env.MONGO_HOST+':'+process.env.MONGO_PORT+'/'+process.env.MONGO_DB, {useNewUrlParser: true}).then(
  ()=>{
    console.log('Connnected to database!');
  }
).catch( ()=>{
    console.log('Mongodb connection failed!');
  }
);

// // jobSchema is used for progress.
// var jobSchema = new mongoose.Schema({
//     name: String,
//     description: String,
//     startTime: String,
//     endTime: String,
//     executionTime: Number,
//     jobType: String,
//     jobTicket: String,
//     datasetSize: Number,
//     objProcessed: Number,
//     // plmCompletedCount: Number,
//     processedCount: Number,
//     iteration: Number,
//     percentageProcessed: Number,
//     validationPassed: Number,
//     validationFailed: Number,
//     complexity: String,
//     status: String,
//     hostname: String,
//     environment: String
//   });
  
//   var Job1 = mongoose.model('Job1', jobSchema);


  function fetchProgress(req,res){
    var outcome = {};
    // var firstParam = {};
  
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
  
    // if(req.body.legacyType){
    //   firstParam = {legacyType: req.body.legacyType}
    // }
      Job.find({}, function(err, jobs){
        if(err){
          console.log(err);
        }else{
          var progress = [];
          // console.log(jobs);
          for(var jobItr in jobs){
            var flag = 0;
            var progPos = 0;
            for(var progItr in progress){
              if(jobs[jobItr].name.localeCompare(progress[progItr].name) == 0 && jobs[jobItr].iteration == progress[progItr].iteration){
                flag = 1;
                progPos = progItr;
              }
            }
            if(flag == 0){
              progress.push(jobs[jobItr]);
            }else{
              progress[progPos].validationPassed = (progress[progPos].validationPassed + jobs[jobItr].validationPassed) / 2;
              progress[progPos].validationFailed = 100 - progress[progPos].validationPassed;
              progress[progPos].datasetSize = progress[progPos].datasetSize + jobs[jobItr].datasetSize;
              progress[progPos].iteration = jobs[jobItr].iteration;
            }
          }
          outcome.data = progress;
          outcome.message='OK'
          res.status(200).json(outcome);
        }
      });
  } 
  
  
  
  //----------------Fetch Progress-------------------------------------------
  router.get('/fetchProgress', function(req, res){
    console.log("GET Called for fetching process");
    fetchProgress(req,res);
    
  });

//   //--------------------PUT ADD Progress---------------------------------------
// app.post('/addProgress', function(req, res){
//     console.log("PUT Called");
//     Progress.find({legacyType: req.body.legacyType}, function(err, progress){
//       if(err){
//         console.log(err);
//       }else{
  
//         var localLegacyType = "";
//         var localLegacyCount = 0;
//         var localIterationSet = Number(req.body.plmCompletedCount);
//         var localPlmCompletedCount = 0;
//         var localTotalCount = 0;
//         var localIteration = 0;
//         var localPercentageCompletion = 0;
//         var localValidationPassed = 0;
//         var localValidationFailed = 0;
  
//         if(progress.length > 0){
  
//           //If Progress with the given name already exits
  
//           localLegacyType = req.body.legacyType;
//           localLegacyCount = progress[0].legacyCount;
//           localPlmCompletedCount =  progress[progress.length - 1].plmCompletedCount + Number(req.body.plmCompletedCount);
//           localTotalCount = progress[progress.length - 1].totalCount;
//           localIteration = progress[progress.length - 1].iteration + 1;
//           localPercentageCompletion = Number(((localPlmCompletedCount/progress[progress.length - 1].totalCount) * 100).toFixed(1));
//           localValidationPassed = Number((((((progress[progress.length - 1].plmCompletedCount * progress[progress.length - 1].validationPassed) / 100) + Number(req.body.validationPassed)) / (progress[progress.length - 1].plmCompletedCount + Number(req.body.plmCompletedCount))) * 100).toFixed(1));
//           localValidationFailed = Number((100 - localValidationPassed).toFixed(1));
  
//         }else{
  
//           //If Progress with the given name does not exits
  
//           localLegacyType = req.body.legacyType;
//           localLegacyCount = Number(req.body.legacyCount);
//           localPlmCompletedCount = Number(req.body.plmCompletedCount);
//           localTotalCount = Number(req.body.totalCount);
//           localIteration = 1;
//           localPercentageCompletion = Number(((Number(req.body.plmCompletedCount)/Number(req.body.totalCount)) * 100).toFixed(1));
//           localValidationPassed = Number(((Number(req.body.validationPassed)/Number(req.body.plmCompletedCount)) * 100).toFixed(1));
//           localValidationFailed = Number((100 - localValidationPassed).toFixed(1));
  
//         }
  
//         var progress = new Progress({
//           legacyType: localLegacyType,
//           legacyCount: localLegacyCount,
//           iterationSet: localIterationSet,
//           plmCompletedCount: localPlmCompletedCount,
//           totalCount: localTotalCount,
//           iteration: localIteration,
//           percentageCompletion: localPercentageCompletion,
//           validationPassed: localValidationPassed,
//           validationFailed: localValidationFailed
//         });
  
//         progress.save(function(error){
//           if(error)
//           {
//             console.log(error);
//           }
//           else{
//             console.log('saved successfully');
//           }
//         });
//       }
//     });
//     Progress.find({legacyType: req.body.legacyType}, function(err, progress){
//       if(err){
//         console.log(err);
//       }else{
//         console.log(progress);
//         res.status(200).json({UpdatedProgress: progress});
//       }
//     });
//     // res.end('OK\n'+);
// });

module.exports = router;