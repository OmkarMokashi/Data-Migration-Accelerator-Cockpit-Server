const express = require('express');
const router = express.Router();

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

var assessmentSchema = new mongoose.Schema({
    legacyType: String,
    legacyCount: Number
  });
  
  var Assessment = mongoose.model('Assessment', assessmentSchema);


//-----------Add Assessment------------------------
router.post('/addAssessment', function(req, res){
    console.log("PUT Called");
    var typeAndCount = req.body.type_count;
    var typeAndCountArray = typeAndCount.split("|");
    var i;
    for(i = 0; i < typeAndCountArray.length; i++){
      var tAndC = typeAndCountArray[i].split("_");
      var assessment = new Assessment({
        legacyType: tAndC[0],
        legacyCount: tAndC[1]
      });
  
      assessment.save(function(error){
        if(error)
        {
          console.log(error);
        }
        else{
          console.log('saved successfully');
        }
      });
    }
    res.status(200).json({AssessmentAddition: "Added Successfully!"});
});
  
router.post('/api/addAssessmentBulk', function(req, res){
    console.log("Bulk Add Assessment Called!");
    (req.body).forEach(function(currentAssessment){
      var assessment = new Assessment({
        legacyType: currentAssessment.legacyType,
        legacyCount: currentAssessment.legacyCount
      });
      assessment.save(function(error){
        if(error)
        {
          console.log(error);
        }
        else{
          console.log('saved successfully');
        }
      });
    });
    res.status(200).json({AssessmentAddition: "Added Successfully!"});
});
//-------------------------------------------------------------------------
  
  
  
//-------------------------------------------------------------------------
router.get('/fetchAssessments', function(req, res){
    console.log("GET Called for fetching Assessment");
  
    var outcome = {};
  //   logger.info("==Getting all the assessments====");
    Assessment.find({}, function(err, assessment){
      if(err){
        console.log(err);
      }else{
        console.log("assessment in router : "+assessment);
        outcome.data = assessment;
        outcome.message='OK'
        // res.end('OK\n'+sendJob);
        res.status(200).json(outcome);
      }
    });
  
});
//-------------------------------------------------------------------------



//---------------------------------------------------------------------------
router.put('/updateAssessment', function(req, res){
  console.log("PUT Called");
  console.log("@"+req.body.legacyType+"@"+req.body.legacyCount);
  Assessment.findOne({legacyType: req.body.legacyType}, function(err, assess){
    if(err){
      console.log(err);
    }else{
      console.log("assess:"+assess.legacyCount);
      Assessment.updateOne({legacyType: req.body.legacyType}, {$set:{legacyCount: Number(req.body.legacyCount)}}, {upsert: true}, function(err){
        if(err)
          console.log(err);
        else
          console.log("Update Successful!");
      });
    }
  });

  Assessment.findOne({legacyType: req.body.legacyType}, function(err, assess){
    if(err){
      console.log(err);
    }else{
      // console.log(jobs);
      res.status(200).json({UpdatedJOB: assess});
    }
  });
});
//---------------------------------------------------------------------------

module.exports = router;
