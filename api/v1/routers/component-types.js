const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const componentTypeModel= require('../models/component-types');
const commonObject = require('../common/common');
require('dotenv').config();



// add components
router.post('/add-component',async (req,res)=>{
    let reqData = {
        "type_name": req.body.type_name
        
    };
    
    
    if (typeof (reqData.type_name) === "string")
        reqData.type_name = reqData.type_name.trim()
    
    
    if (isEmpty(reqData.type_name)) {
        
        return res.status(409).send({
          "success": false,
          "status": 409,
          "message": "Invalid request data. 'type_name' is required and cannot be empty."
        });
      }


    //check duplicate
    let existingData = await componentTypeModel.getByTypeName(reqData.type_name);


    if (!isEmpty(existingData)) {
        return res.status(409).send({
            "success": false,
            "status": 409,
            "message": existingData[0].status == "1" ? "This Components Type Already Exists." : "This Components Type Already Exists but Deactivate, You can activate it."
        });

    }

    
    reqData.created_by = 1;
    reqData.updated_by = 1;

    reqData.created_at =await commonObject.getGMT();
    reqData.updated_at =await commonObject.getGMT();




    let result = await componentTypeModel.addNew(reqData);

    if (result.affectedRows == undefined || result.affectedRows < 1) {
        return res.status(500).send({
            "success": false,
            "status": 500,
            "message": "Something Wrong in system database."
        });
    }

    return res.status(201).send({
        "success": true,
        "status": 201,
        "message": "Component Type Added Successfully."
    });


});




//component-list 
router.get('/list',async(req,res)=>{
    let result = await componentTypeModel.getList()
    
    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Components Type List.",
        "count": result.length,
        "data": result
    });
})


// active components
router.get('/activeComponents',async (req, res) => {

    let result = await componentTypeModel.getActiveList();

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": "Components Type List.",
        "count": result.length,
        "data": result
    });
});




// component update
router.put('/update',async(req,res)=>{
    let reqData = {
        "id":req.body.id,
        "type_name": req.body.type_name
        
    };
    console.log(reqData);
    
 reqData.updated_by = 1;


let validateId = isNaN(reqData.id);

if (validateId) {
  return res.status(409).send({
    "success": false,
    "status": 409,
    "message": "Invalid request data. 'id' must be an integer."
  });
}

  if (typeof(reqData.type_name) === "string"){
    reqData.type_name = reqData.type_name.trim()}
    else{
        req.body.id = validateId.data;
        reqData.id = validateId.data;
      
    }

  if (!reqData.type_name || reqData.type_name === '') {
    return res.status(409).send({
      "success": false,
      "status": 409,
      "message": "Invalid request data. 'type_name' is required and cannot be empty."
    });
    
  }

 

  let existingDataById = await componentTypeModel.getById(reqData.id);
    if (isEmpty(existingDataById)) {

        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "No data found",

        });
    } 
    let updateData = {};

   
    if (existingDataById[0].type_name !== reqData.type_name) {

        
          let existingDataByType= await componentTypeModel.getDataByType(reqData.type_name);
  
          if (!isEmpty(existingDataByType) && existingDataByType[0].id != reqData.id) {
            
            
            return res.status(404).send({
                "success": false,
                "status": 404,
                "message": existingDataByType[0].status == "1" ? "This id not match." : "This components type Already Exists but Deactivate, You can activate it.",
    
            });
          }
          
  
            willWeUpdate = 1;
            updateData.type_name = reqData.type_name;
  
        }
  
    
    
    
    if (willWeUpdate == 1) {
    
      updateData.updated_by = 1;
      updateData.updated_at = await commonObject.getGMT();

    
      let result = await componentTypeModel.updateById(reqData.id,updateData);
    
    
      if (result.affectedRows == undefined || result.affectedRows < 1) {
          return res.status(500).send({
              "success": true,
              "status": 500,
              "message": "Something Wrong in system database."
          });
      }
    
    
      return res.status(200).send({
          "success": true,
          "status": 200,
          "message": "Component Type successfully updated."
      });
    
    
    } else {
      return res.status(200).send({
          "success": true,
          "status": 200,
          "message": "Nothing to update."
      });
    }
})










// delete 
router.delete('/delete', async (req, res) => {

    let reqData = {
        "id":req.body.id,
    }
   console.log(reqData)

    reqData.updated_by = 1

    let validateId = await commonObject.checkItsNumber(reqData.id);
    
    if (validateId.success == false || !Number.isInteger(validateId.data)) {

        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "Value should be integer."

        });
    } else {
        req.body.id = validateId.data;
        reqData.id = validateId.data;
    }
 
   let existingDataById = await componentTypeModel.getById(reqData.id);
    if (isEmpty(existingDataById)) {

        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "No data found",

        });
    }

     let data = {
      status : 0,
      updated_by : reqData.updated_by,
      updated_at :await commonObject.getGMT()
     }

     let result = await componentTypeModel.delUpdateById(reqData.id,data);


     if (result.affectedRows == undefined || result.affectedRows < 1) {
         return res.status(500).send({
             "success": true,
             "status": 500,
             "message": "Something Wrong in system database."
         });
     }
   
   
     return res.status(200).send({
         "success": true,
         "status": 200,
         "message": "Component Type successfully deleted."
     });

});






// details
router.get('/details/:id',async(req,res)=>{
    
    let id = req.params.id;

    let validateId = await commonObject.checkItsNumber(id);


    if (validateId.success == false) {
      return res.status(400).send({
        "success": false,
        "status": 400,
        "message": "Value should be integer."
      });
    } else {
      id = validateId.data;
    }

    let result = await componentTypeModel.getById(id);

    if (isEmpty(result)) {

      return res.status(404).send({
        success: false,
        status: 404,
        message: "No data found",
      });

    } else {

      return res.status(200).send({
        success: true,
        status: 200,
        message: "Components Type Details.",
        data: result,
      });
      
    }
})


module.exports = router;