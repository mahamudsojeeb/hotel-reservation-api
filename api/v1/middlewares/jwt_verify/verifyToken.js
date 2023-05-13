var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const isEmpty = require("is-empty");

const commonObject = require('../../common/common');
const userModel = require('../../models/member');


router.use(async function(req,res,next){
    const token = req.headers['x-access-token'];

    console.log("ddddddddddddddddddd")
    console.log(req.headers
        )
    console.log(token)
    if(token){
        jwt.verify(token,process.env.JWT_SECRET,async function(err,decoded){
            if (err) {
                return res.status(400)
                    .send({
                        "success": false,
                        "status": 400,
                        "message": "Timeout Login First"
                    });
            }
            else{
                next();
            }
        })
    }
    else{
        return res.status(400).send({
            "success": false,
            "status": 400,
            "message": "token required"

        })
    }
})



module.exports = router;