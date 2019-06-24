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
  
  var objectStatus = mongoose.model('objectStatus', statusSchema);

//--------------Add Object Status--------------------
router.post('/addObjectStatus', function(req, res){
    console.log("Post called for adding status");
    var status = new objectStatus({
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
  
router.post('/api/addBulkObjectStatus', function(req, res){
    console.log("Post called for adding status");
    var objectStatusIds = []
    for(itr in req.body){
  
      var status = new objectStatus({
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
          objectStatusIds.push(statusObjId);
          // res.status(200).json({ObjectId: statusObjId});
        }
      });
    }
    res.status(200).json({Message: "Success",ObjectIds: objectStatusIds});
});
//-------------------------------------------------------
  
  
  
  
//-------------Fetch Object Status-------------------------
router.get('/fetchObjectStatus',function(req,res){
    var outcome = {}
    const pageSize = Number(req.query.pageSize);
    const page = Number(req.query.page);
    let fetchedStatus;
    var searchName = req.query.name;
    // console.log("Page Size : " + pageSize + " page : " + page);
    var statusQuery;
    // console.log(searchName);
    if(searchName == undefined || searchName.localeCompare("") == 0){
      statusQuery = objectStatus.find();
    }else{
      statusQuery = objectStatus.find({name: {'$regex':searchName}});
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
        return objectStatus.countDocuments();
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
//----------------------------------------------------
  
  
  
  
//---------------Update Object Status------------------
router.put('/api/bulkUpdateObjectStatus', function(req, res){
    console.log("Bulk Update File Status Called!");
    (req.body).forEach(function(currentObjectStatus){
      objectStatus.findOne({name: currentObjectStatus.name}, function(err, objectstatus){
        if(err){
          console.log(err);
        }else{
          objectStatus.updateOne({name: currentObjectStatus.name}, {$set:{enlisted: currentObjectStatus.enlisted, 
            extracted: currentObjectStatus.extracted, 
            inCleaning: currentObjectStatus.inCleaning, 
            cleaned: currentObjectStatus.cleaned, 
            verified: currentObjectStatus.verified, 
            mapped: currentObjectStatus.mapped, 
            inLoadtest: currentObjectStatus.inLoadtest, 
            transferred: currentObjectStatus.transferred, 
            validated: currentObjectStatus.validated, 
            inProd: currentObjectStatus.inProd}}, {upsert: true}, function(err){
            if(err)
              console.log(err);
            else
              console.log(currentObjectStatus.name+" Update Successful! "+currentObjectStatus.inProd);
          });
        }
      });
    });
    res.status(200).json({Message: "Success"});
});
//--------------------------------------------------------------------------

module.exports = router;