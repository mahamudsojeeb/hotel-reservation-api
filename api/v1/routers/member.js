const express = require("express");
const isEmpty = require("is-empty");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const commonObject = require("../common/common");
const memberModel = require("../models/member");
const verifyToken = require("../middlewares/jwt_verify/verifyToken")

require("dotenv").config();


router.post("/add-super_admin", async (req, res) => {
  let userInfo = {}
  let memberInfo = {}
    // according to the DB Column name

    
    reqData = {
      name: req.body.name,
      adderess: req.body.adderess,
      phone: req.body.phone

    };

    hashedpassword = bcrypt.hashSync(req.body.password, 8);
    reqData.password = hashedpassword;
    reqData.role = 1;
    reqData.status =1;

  
    reqData.created_by = 1;
    reqData.updated_by = 1;
  
    reqData.created_at = await commonObject.getGMT();
    reqData.updated_at = await commonObject.getGMT();
  
    // name validation
    if (isEmpty(reqData.name)) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Invalid request data. 'name' is required and cannot be empty.",
      });
    } else {
      if (typeof reqData.name === "string") {
        reqData.name = reqData.name.trim();
      } else {
        return res.status(400).send({
          success: false,
          status: 400,
          message: "Name should be string",
        });
      }
    }
  
    
  
    // phone validation
  
    if (isEmpty(reqData.phone)) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Invalid request data. 'Phone' is required and cannot be empty.",
      });
    }
  
    let validatePhone = await commonObject.isValidPhoneNumberOfBD(reqData.phone);
    if (validatePhone == false) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Phone is not valid",
      });
    }
  
    let existingUserByPhone = await memberModel.getUserByPhone(reqData.phone);
    console.log(existingUserByPhone);
  
    if (!isEmpty(existingUserByPhone)) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Phone already in Use.",
      });
    }
    userInfo = {
      // according to the DB Column name
  
      "phone": reqData.phone,
      "role": reqData.role,
      "status": reqData.status,
      "password": reqData.password,
      "created_by": reqData.created_by,
      "updated_by": reqData.updated_by,
      "created_at":reqData.created_at,
      "created_at": reqData.updated_at
  };
  
  
  memberInfo = {
    "name":reqData.name,
    "adderess":reqData.adderess,
    "phone": reqData.phone,
    "role": reqData.role,
    "status": reqData.status,
    "created_by": reqData.created_by,
    "updated_by": reqData.updated_by,
    "created_at":reqData.created_at,
    "created_at": reqData.updated_at
  };
  
  
  
    let result = await memberModel.addNewAdmin(userInfo,memberInfo);
  
  
    if (result.affectedRows == undefined || result.affectedRows < 1) {
      return res.status(500).send({
        success: false,
        status: 500,
        message: "Something Wrong in system database.",
      });
    }
  
    return res.status(201).send({
      success: true,
      status: 201,
      message: "member added Successfully.",
    });
  
  
    
  });



  router.post("/login", async (req, res) => {
    reqData = {
        phone: req.body.phone,
        password : req.body.password
  
      };
    

    let existingUserByPhone = await memberModel.getUserByPhone(reqData.phone);
    console.log(existingUserByPhone[0].role);
    
  
    if (isEmpty(existingUserByPhone)) {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "No user found",
      });
    }

    else{
        let UserInfo;
        
      
        if(existingUserByPhone[0].role == 1){
        userInfo = await memberModel.getAdmin(reqData.phone);
  
      }
      else if(existingUserByPhone[0].role == 2){
        userInfo = await memberModel.getMember(reqData.phone);
      }
     
      const isValidpassword = await bcrypt.compare(req.body.password,existingUserByPhone[0].password);
      if(isValidpassword){
        const tokenn = jwt.sign({
          userId : existingUserByPhone[0].id,
          userPhone : existingUserByPhone[0].phone,
          userName: userInfo[0].name,
          userStatus:existingUserByPhone[0].status
  

        },process.env.JWT_SECRET,{
          expiresIn: '24h'
        })
        return res.status(200).send({
          success:true,
          status:200,
          message1: "login successful",
          message2: userInfo[0],
          token: tokenn

        })
         
      }
      else{
        return res.status(400).send({
          success:false,
          status:400,
          message:"login error"

        })

      }



    }




  });



router.post('/userRegistration', verifyToken, async (req, res) => {


  let userInfo = {};
  let memberInfo = {};

  
  reqData = {
    name: req.body.name,
    adderess: req.body.adderess,
    nid: req.body.nid,
    phone: req.body.phone,

  };

  hashedpassword = bcrypt.hashSync(req.body.password, 8);
  reqData.password = hashedpassword;
  reqData.role = 2;
  reqData.status =1;


  reqData.created_by = 2;
  reqData.updated_by = 2;

  reqData.created_at = await commonObject.getGMT();
  reqData.updated_at = await commonObject.getGMT();

  // name validation
  if (isEmpty(reqData.name)) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid request data. 'name' is required and cannot be empty.",
    });
  } else {
    if (typeof reqData.name === "string") {
      reqData.name = reqData.name.trim();
    } else {
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Name should be string",
      });
    }
  }
  let trimmedName = reqData.name;


  for(let i= 0;i<trimmedName.length-1;i++){

    if(trimmedName.charCodeAt(i)==32&&trimmedName.charCodeAt(i+1)==32){
      return res.status(400).send({
        success: false,
        status: 400,
        message: "Name cannot contain double space",
      }); 
    }
  }
    
      




  
  

  // phone validation

  if (isEmpty(reqData.phone)) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid request data. 'Phone' is required and cannot be empty.",
    });
  }

  let validatePhone = await commonObject.isValidPhoneNumberOfBD(reqData.phone);
  if (validatePhone == false) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Phone is not valid",
    });
  }

  let existingUserByPhone = await memberModel.getUserByPhone(reqData.phone);
  //console.log(existingUserByPhone);

  if (!isEmpty(existingUserByPhone)) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Phone already in Use.",
    });
  }

  //password verification
  let pass = req.body.password;
  for(let i=0;i<pass.length;i++){
    if(pass.charCodeAt(i)==32){
      return res.status(400).send({
        success: false,
        status: 400,
        message: "password cannot contain white spaces",
      });

    }

  }



  //nid verification
  
  if (isEmpty(reqData.nid)) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid request data. 'NID' is required and cannot be empty.",
    });
  }

  let nid = parseInt(reqData.nid);
  if (isNaN(nid) || nid < 0) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid request data. 'NID' must be a positive integer.",
    });
  }

  let nidLength = nid.toString().length;
  if (nidLength !== 13 && nidLength !== 17) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Invalid NID. NID must be either 13 or 17 digits.",
    });
  }

  let existingUserByNid = await memberModel.getUserByNid(nid);
  if (!isEmpty(existingUserByNid)) {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "NID already in Use.",
    });
  }
  userInfo = {
    // according to the DB Column name

    "phone": reqData.phone,
    "role": reqData.role,
    "status": reqData.status,
    "password": reqData.password,
    "created_by": reqData.created_by,
    "updated_by": reqData.updated_by,
    "created_at":reqData.created_at,
    "created_at": reqData.updated_at
};


memberInfo = {
  "name":reqData.name,
  "adderess":reqData.adderess,
  "phone": reqData.phone,
  "nid":reqData.nid,
  "role": reqData.role,
  "status": reqData.status,
  "created_by": reqData.created_by,
  "updated_by": reqData.updated_by,
  "created_at":reqData.created_at,
  "created_at": reqData.updated_at
};



  let result = await memberModel.addNewMember(userInfo,memberInfo);


  if (result.affectedRows == undefined || result.affectedRows < 1) {
    return res.status(500).send({
      success: false,
      status: 500,
      message: "Something Wrong in system database.",
    });
  }

  return res.status(201).send({
    success: true,
    status: 201,
    message: "member added Successfully.",
  });



  


 });

// router.post('/profileUpdate', [verifyToken, routeAccessChecker("adminResetPassword")], async (req, res) => {


// });


module.exports = router;
