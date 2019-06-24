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

var statusSchema = new mongoose.Schema({
    name: String,
    enlisted: String,
    extracted: String,
    inCleaning: String,
    cleaned: String,
    verified: String,
    mapped: String,
    inLoadtest: String,
    transferred: String,
    validated: String,
    inProd: String
  });
  
  var fileStatus = mongoose.model('fileStatus', statusSchema);

//-----------Add File Status------------------------
router.post('/addFileStatus', function(req, res){
    console.log("Post called for adding status");
    var status = new fileStatus({
      name: req.body.name,
      enlisted: req.body.enlisted,
      extracted: req.body.extracted,
      inCleaning: req.body.inCleaning,
      cleaned: req.body.cleaned,
      verified: req.body.verified,
      mapped: req.body.mapped,
      inLoadtest: req.body.inLoadtest,
      transferred: req.body.transferred,
      validated: req.body.validated,
      inProd: req.body.inProd
    });
    var statusObjId;
    status.save(function(error, statusObj){
      statusObjId = statusObj._id;
      if(error){
        console.log(error);
      }else{
        console.log("File status saved successfuly");
        res.status(200).json({ObjectId: statusObjId});
      }
    });
});
  
router.post('/api/addBulkFileStatus', function(req, res){
    console.log("Post called for adding status");
    var fileStatusIds = [];
    for(itr in req.body){
  
      var status = new fileStatus({
        name: req.body[itr].name,
        enlisted: req.body[itr].enlisted,
        extracted: req.body[itr].extracted,
        inCleaning: req.body[itr].inCleaning,
        cleaned: req.body[itr].cleaned,
        verified: req.body[itr].verified,
        mapped: req.body[itr].mapped,
        inLoadtest: req.body[itr].inLoadtest,
        transferred: req.body[itr].transferred,
        validated: req.body[itr].validated,
        inProd: req.body[itr].inProd
      });
      var statusObjId;
      status.save(function(error, statusObj){
        statusObjId = statusObj._id;
        if(error){
          console.log(error);
        }else{
          console.log("File status saved successfuly");
          fileStatusIds.push(statusObjId);
          // res.status(200).json({ObjectId: statusObjId});
        }
      });
  
    }
    res.status(200).json({Message: "Success",ObjectId: fileStatusIds});
});
//--------------------------------------------------
  
  
  
//---------Fetch File Status------------------------
router.get('/fetchFileStatus',function(req,res){
    var outcome = {}
    const pageSize = Number(req.query.pageSize);
    const page = Number(req.query.page);
    let fetchedStatus;
    var searchName = req.query.name;
    console.log("search Name : "+ searchName);
    console.log("Page Size : " + pageSize + " page : " + page);
    var statusQuery;
    if(searchName == undefined || searchName.localeCompare("") == 0){
      statusQuery = fileStatus.find();
      console.log("in if : "+ statusQuery);
    }else{
      statusQuery = fileStatus.find({name: {'$regex':searchName}});
      console.log("in else : "+ statusQuery);
    }
  
    if(pageSize && page){
      statusQuery
        .skip(pageSize*(page - 1))
        .limit(pageSize);
    }
  
    setTimeout(()=>{
      statusQuery.then(document=>{
        fetchedStatus = document;
        // console.log("Fetched Status : "+fetchedStatus);
        return fileStatus.countDocuments();
      }).then(count=>{
        res.status(200).json({
          data: fetchedStatus,
          totalRecords: count,
          message: "OK"
        });
      });
    },0);
  
    // Status.find({},function(err, status){
    //   if(err){
    //     console.log(err);
    //   }else{
    //     console.log(status);
    //     outcome.data = status;
    //     outcome.message = "OK";
    //     res.status(200).json(outcome);
    //   }
    // });
});
//-------------------------------------------------
  
  
  
  
//------------Update File Status-------------------
router.put('/api/bulkUpdateFileStatus', function(req, res){
    console.log("Bulk Update File Status Called!");
    (req.body).forEach(function(currentFileStatus){
      fileStatus.findOne({name: currentFileStatus.name}, function(err, filestatus){
        if(err){
          console.log(err);
        }else{
          fileStatus.updateOne({name: currentFileStatus.name}, {$set:{enlisted: currentFileStatus.enlisted, 
            extracted: currentFileStatus.extracted, 
            inCleaning: currentFileStatus.inCleaning, 
            cleaned: currentFileStatus.cleaned, 
            verified: currentFileStatus.verified, 
            mapped: currentFileStatus.mapped, 
            inLoadtest: currentFileStatus.inLoadtest, 
            transferred: currentFileStatus.transferred, 
            validated: currentFileStatus.validated, 
            inProd: currentFileStatus.inProd}}, {upsert: true}, function(err){
            if(err)
              console.log(err);
            else
              console.log(currentFileStatus.name+" Update Successful!");
          });
        }
      });
    });
    res.status(200).json({Message: "Success"});
});
//--------------------------------------------------------------------------

module.exports = router;