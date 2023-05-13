const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();
const billModel= require('../models/bill');
const monthModel= require('../models/month');
const componentTypeModel= require('../models/component-types');
const commonObject = require('../common/common');
require('dotenv').config();






// add bills
router.post('/add-bill',async (req,res)=>{

 reqData = {
    
    "users_id":req.body.users_id,
    "months_id":req.body.months_id,
    "component_type_id":req.body.component_type_id,
    "amount": req.body.amount,
    "year":req.body.year
 }
 console.log(reqData);

    reqData.created_by = 1;
    reqData.updated_by = 1;

    reqData.created_at = await commonObject.getGMT();
    reqData.updated_at = await commonObject.getGMT();

 
let validateUserId = await commonObject.checkItsNumber(reqData.users_id);
  
if (validateUserId.success == false) {
    return res.status(400).send({
        "success": false,
        "status": 400,
        "message": "User Invalid Id"
    });
} else if (validateUserId.data < 0) {
    return res.status(400).send({
        "success": false,
        "status": 400,
        "message": "User Id Invalid "
    });
} else {
    req.body.users_id = validateUserId.data;
    reqData.users_id = validateUserId.data;
}
 

// validate  months_id
let validateMonthId = await commonObject.checkItsNumber(reqData.months_id);
  
if (validateMonthId.success == false) {
   return res.status(400).send({
       "success": false,
       "status": 400,
       "message": "Invalid Month"
   });
}else if (validateMonthId.data <= 0) {
   return res.status(400).send({
       "success": false,
       "status": 400,
       "message": "Invalid Month"
   });
} else {
   req.body.months_id = validateMonthId.data;
   reqData.months_id = validateMonthId.data;

   let existingMonthId = await monthModel.getById(reqData.months_id);
   if (isEmpty(existingMonthId)) {
       return res.status(404).send({
           "success": false,
           "status": 404,
           "message": "Month Id not found"
       });
   }
}
 

   let validateComponentTypeId = await commonObject.checkItsNumber(reqData.component_type_id);
   if (validateComponentTypeId.success == false) {
       return res.status(400).send({
           "success": false,
           "status": 400,
           "message": "Invalid Component Type Id"
       });
   } else if (validateComponentTypeId.data <= 0) {
       return res.status(400).send({
           "success": false,
           "status": 400,
           "message": "Invalid Component Type Id"
       });
   } else {
       req.body.component_type_id = validateComponentTypeId.data;
       reqData.component_type_id = validateComponentTypeId.data;

   let existingComponetId = await componentTypeModel.getById(reqData.component_type_id);
    if (isEmpty(existingComponetId)) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "Component Id not found"
        });
    }

   }
   


    // validate amount
    const ValidateAmount = parseFloat(reqData.amount);
    

    if (isNaN(ValidateAmount) || ValidateAmount < 0 ) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: 'Invalid Amount'
      });
    }else{
        req.body.amount = ValidateAmount
        reqData.amount = ValidateAmount
    }



     // validate year
const ValidateYear = parseFloat(reqData.year);

if (isNaN(ValidateYear) ||  ValidateYear < 2022 || ValidateYear > 2023) {
  return res.status(400).send({
    success: false,
    status: 400,
    message: 'Invalid Year. Year must be between 2022 and 2023'
  });
} else {
  req.body.year = ValidateYear;
 reqData.year = ValidateYear;
}

let result = await billModel.addNew(reqData);


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
    "message": "bill added Successfully."
});
   
    
});



// bill list
router.get('/list', async (req, res) => {
   let result = await billModel.getList();
   
   for (let i = 0; i < result.length; i++) {
     let monthId = result[i].months_id;
     let monthResult = await monthModel.getMonthNameById(monthId);
   
     result[i].month_name = monthResult[0].month_name;

     let componentId = result[i].component_type_id;
     let componentResult = await componentTypeModel.getComponentNameById(componentId);
    
     if (componentResult.length > 0) {
       result[i].type_name = componentResult[0].type_name;
     } else {
       result[i].type_name = null;
     }
   }

   return res.status(200).send({
     "success": true,
     "status": 200,
     "message": "Bills List.",
     "count": result.length,
     "data": result
   });
 });


 




// bill details
// router.get('/details/:id',async(req,res)=>{
    
//    let id = req.params.id;

//    let validateId = await commonObject.checkItsNumber(id);


//    if (validateId.success == false) {
//      return res.status(400).send({
//        "success": false,
//        "status": 400,
//        "message": "Value should be integer."
//      });
//    } else {
//      id = validateId.data;
//    }

//    let result = await billModel.getById(id);

//    if (isEmpty(result)) {

//      return res.status(404).send({
//        success: false,
//        status: 404,
//        message: "No data found",
//      });

//    } else {
     
     

//      return res.status(200).send({
//        success: true,
//        status: 200,
//        message: "Bill Details.",
//        data: result[0],
//      });
     
//    }
// })


//
router.get('/details/:id', async(req, res) => {
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
 
   let result = await billModel.getById(id);
 
   if (isEmpty(result)) {
     return res.status(404).send({
       success: false,
       status: 404,
       message: "No data found",
     });
   } else {
     
     let monthId = result[0].months_id;
     let monthResult = await monthModel.getMonthNameById(monthId);
     
     result[0].month_name = monthResult[0].month_name;


     let componentId = result[0].component_type_id;
     let componentResult = await componentTypeModel.getComponentNameById(componentId);
    
     result[0].type_name= componentResult[0].type_name;

    
     return res.status(200).send({
       success: true,
       status: 200,
       message: "Bill Details.",
       data: result[0]
       })
     };
   }
 )
 




// update 
     
router.put('/update', async (req, res) => {
   let reqData = {
   "id": req.body.id,
   "users_id": req.body.users_id,
   "months_id": req.body.months_id,
   "component_type_id": req.body.component_type_id,
   "amount": req.body.amount,
   "year": req.body.year
};
   
reqData.updated_by = 1;
   
   // Validate id
   if (isNaN(reqData.id)) {
   return res.status(400).send({
   "success": false,
   "status": 400,
   "message": "Invalid request data. 'id' must be an integer."
   });
   } else {
   req.body.id = reqData.id;
   reqData.id = reqData.id
   }
   
   // Check exists id
   let existingDataById = await billModel.getById(reqData.id);
   if (isEmpty(existingDataById)) {
   return res.status(404).send({
   "success": false,
   "status": 404,
   "message": "No data found",
});
 }

 
   let updateData = {};
   let willWeUpdate = 0;


   let validateUserId = await commonObject.checkItsNumber(reqData.users_id);
  
   if (validateUserId.success == false) {
       return res.status(400).send({
           "success": false,
           "status": 400,
           "message": "User Invalid Id"
       });
   } else if (validateUserId.data <= 0) {
       return res.status(400).send({
           "success": false,
           "status": 400,
           "message": "User Id Invalid "
       });
   } else {
       
     if (existingDataById[0].users_id != reqData.users_id) {
         willWeUpdate = 1;
         updateData.users_id = reqData.users_id;
   }
      
   }

    
   // Check if 'months_id' needs to be updated

let validateMonthId = await commonObject.checkItsNumber(reqData.months_id);
  
if (validateMonthId.success == false) {
   return res.status(400).send({
       "success": false,
       "status": 400,
       "message": "Invalid Month"
   });
}else if (validateMonthId.data <= 0) {
   return res.status(400).send({
       "success": false,
       "status": 400,
       "message": "Invalid Month"
   });
} else {
   req.body.months_id = validateMonthId.data;
   reqData.months_id = validateMonthId.data;

   let existingMonthId = await monthModel.getById(reqData.months_id);
   if (isEmpty(existingMonthId)) {
       return res.status(404).send({
           "success": false,
           "status": 404,
           "message": "Month Id not found"
       });
   }
   if (existingDataById[0].months_id != reqData.months_id) {
      willWeUpdate = 1;
      updateData.months_id = reqData.months_id;
}
  
}


   // Check component_type_id updated
   let validateComponentTypeId = await commonObject.checkItsNumber(reqData.component_type_id);
   if (validateComponentTypeId.success == false) {
       return res.status(400).send({
           "success": false,
           "status": 400,
           "message": "Invalid Component Type Id"
       });
   } else if (validateComponentTypeId.data <= 0) {
       return res.status(400).send({
           "success": false,
           "status": 400,
           "message": "Invalid Component Type Id"
       });
   } else {
       req.body.component_type_id = validateComponentTypeId.data;
       reqData.component_type_id = validateComponentTypeId.data;

   let existingComponetId = await componentTypeModel.getById(reqData.component_type_id);
    if (isEmpty(existingComponetId)) {
        return res.status(404).send({
            "success": false,
            "status": 404,
            "message": "Component Id not found"
        });
    }
    if (existingDataById[0].component_type_id != reqData.component_type_id) {
      willWeUpdate = 1;
      updateData.component_type_id = reqData.component_type_id;
}
   }



 
   
   // Check amount updated
   const ValidateAmount = parseFloat(reqData.amount);
    

   if (isNaN(ValidateAmount) || ValidateAmount < 0 ) {
     return res.status(400).send({
       success: false,
       status: 400,
       message: 'Invalid Amount'
     });
   }else{
      if (existingDataById[0].amount != reqData.amount) {
         willWeUpdate = 1;
         updateData.amount = reqData.amount;
   }
    
   }





  // check year 

  const ValidateYear = parseFloat(reqData.year);

if (isNaN(ValidateYear) ||  ValidateYear < 2022 || ValidateYear > 2023) {
  return res.status(400).send({
    success: false,
    status: 400,
    message: 'Invalid Year. Year must be between 2022 and 2023'
  });
} else {
   if (existingDataById[0].year != reqData.year) {
      willWeUpdate = 1;
      updateData.year = reqData.year;
}
}


if (willWeUpdate == 1) {
    
   updateData.updated_by = 1;
   updateData.updated_at = await commonObject.getGMT();

 

   let result = await billModel.updateById(reqData.id,updateData);
 
 
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
   

});





// delete 

router.delete('/delete', async (req, res) => {

   let reqData = {
       "id":req.body.id,
   }
  console.log(reqData)

   reqData.updated_by = 1

   let existingDataById = await billModel.getById(reqData.id);
   if (isEmpty(existingDataById)) {

       return res.status(404).send({
           "success": false,
           "status": 404,
           "message": "No data found",

       });
   }

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

  

    let data = {
     status : 0,
     updated_by : reqData.updated_by,
     updated_at :await commonObject.getGMT()
    }

    let result = await billModel.delUpdateById(reqData.id,data);


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



//active List
router.get('/activeList', async (req, res) => {

   let result = await billModel.getActiveList();
   for (let i = 0; i < result.length; i++) {
      let monthId = result[i].months_id;
      let monthResult = await monthModel.getMonthNameById(monthId);
    
      result[i].month_name = monthResult[0].month_name;
 
      let componentId = result[i].component_type_id;
      let componentResult = await componentTypeModel.getComponentNameById(componentId);
     
      if (componentResult.length > 0) {
        result[i].type_name = componentResult[0].type_name;
      } else {
        result[i].type_name = null;
      }
    }

   return res.status(200).send({
       "success": true,
       "status": 200,
       "message": "Bill List.",
       "count": result.length,
       "data": result
   });
});



// Enable Disable

router.put('/changeStatus', async (req, res) => {

   let reqData = {
     "id": req.body.id
 }

 reqData.updated_by = 1;

 let validateId = await commonObject.checkItsNumber(reqData.id);


 if (validateId.success == false) {

     return res.status(400).send({
         "success": false,
         "status": 400,
         "message": "Value should be integer."

     });
 } else {
     req.body.id = validateId.data;
     reqData.id = validateId.data;
     
 }

 let existingDataById = await billModel.getById(reqData.id);
 if (isEmpty(existingDataById)) {

     return res.status(404).send({
         "success": false,
         "status": 404,
         "message": "No data found",

     });
 }

 let data = {
   status: existingDataById[0].status == 1 ? 2 : 1,
   updated_by : reqData.updated_by,
   updated_at :await commonObject.getGMT()
}

let result = await billModel.updateById(reqData.id,data);


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
   "message": "Bill status has successfully changed."
});

});



module.exports = router;

