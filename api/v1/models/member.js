const { connectionHostelPool } = require('../connections/connection');
const queries = require('../queries/member');
const transactionModel = require('./transaction')
const isEmpty = require('is-empty')





let getUserByEmail = async (email = "") => {
    return new Promise((resolve, reject) => {
        connectionHostelPool.query(queries.getUserByEmail(), [email], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}
let getAdmin = async (phone = "") => {
    return new Promise((resolve, reject) => {
        connectionHostelPool.query(queries.getAdmin(), [phone], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}
let getMember=async (phone = "") => {
    return new Promise((resolve, reject) => {
        connectionHostelPool.query(queries.getMember(), [phone], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getUserByPhone = async (phone = "") => {
    return new Promise((resolve, reject) => {
        connectionHostelPool.query(queries.getUserByPhone(), [phone], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}

let getUserByNid = async (nid = "") => {
    return new Promise((resolve, reject) => {
        connectionHostelPool.query(queries.getUserByNid(), [nid], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}



let addNew = async (info = {}) => {

    return new Promise((resolve, reject) => {
        connectionHostelPool.query(queries.addNew(), info, (error, result, fields) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
}
let addNewAdmin = async(userInfo ={},memberInfo={})=>{
    return new Promise((resolve, reject) => {
        connectionHostelPool.getConnection(function(err,conn){
            conn.beginTransaction(async function(error){
                if(error){
                    return conn.rollback(function (){
                        conn.release();
                        resolve([]);
                    });
                }

             let profileResult = await transactionModel.addNewAdmin(memberInfo, conn);
             if (isEmpty(profileResult) || profileResult.affectedRows == undefined || profileResult.affectedRows < 1) {
                return conn.rollback(function () {
                    conn.release();
                    resolve([]);
                });
            }

            userInfo.profile_id = profileResult.insertId;

            
                conn.query(queries.addUser(), [userInfo], async (error, result, fields) => {
                    if (error) {

                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    } else {

                        conn.commit(function (err) {
                            if (err) {
                                return conn.rollback(function () {
                                    conn.release();
                                    resolve([]);
                                });
                            }
                            conn.release();
                            return resolve(result);
                        });
                    }
                });
                




            })
        })
        // connectionHostelPool.query(queries.addNewMember(), info, (error, result, fields) => {
        //     if (error) reject(error);
        //     else resolve(result);
        // });
    });

}

let addNewMember =  async(userInfo = {},memberInfo = {}) => {


    return new Promise((resolve, reject) => {
        connectionHostelPool.getConnection(function(err,conn){
            conn.beginTransaction(async function(error){
                if(error){
                    return conn.rollback(function (){
                        conn.release();
                        resolve([]);
                    });
                }

             let profileResult = await transactionModel.addNewMember(memberInfo, conn);
             if (isEmpty(profileResult) || profileResult.affectedRows == undefined || profileResult.affectedRows < 1) {
                return conn.rollback(function () {
                    conn.release();
                    resolve([]);
                });
            }
            console.log(profileResult)

            userInfo.profile_id = profileResult.insertId;
            
                conn.query(queries.addUser(), [userInfo], async (error, result, fields) => {
                    if (error) {

                        return conn.rollback(function () {
                            conn.release();
                            resolve([]);
                        });
                    } else {

                        conn.commit(function (err) {
                            if (err) {
                                return conn.rollback(function () {
                                    conn.release();
                                    resolve([]);
                                });
                            }
                            conn.release();
                            return resolve(result);
                        });
                    }
                });


            })
        })
        // connectionHostelPool.query(queries.addNewMember(), info, (error, result, fields) => {
        //     if (error) reject(error);
        //     else resolve(result);
        // });
    });
}



let getList = async () => {
    return new Promise((resolve, reject) => {
        connectionHostelPool.query(queries.getList(), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getActiveList = async () => {
    return new Promise((resolve, reject) => {
        connectionHostelPool.query(queries.getActiveList(), (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getById = async (id = 0) => {
    return new Promise((resolve, reject) => {
        connectionHostelPool.query(queries.getById(), [id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}


let getDataByType = async (month_name = "") => {
    return new Promise((resolve, reject) => {
        connectionHostelPool.query(queries.getDataByType(), [month_name], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}






let updateById = async (id = 0, updateData = {}, conn = undefined) => {

    
    let connection = connectionHostelPool;
    if (conn !== undefined) connection = conn;
    

    let keysOfUpdateData = Object.keys(updateData);
    
    let dataParameterUpdateData = [];

    for (let index = 0; index < keysOfUpdateData.length; index++) {
        dataParameterUpdateData.push(updateData[keysOfUpdateData[index]]);
    }

    console.log(dataParameterUpdateData)
    return new Promise((resolve, reject) => {
        connection.query(queries.updateById(updateData), [...dataParameterUpdateData, id], (error, result, fields) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
}



let delUpdateById = async (id = 0, data = {}, conn = undefined) => {

    
    let connection = connectionHostelPool;
    if (conn !== undefined) connection = conn;
    

    let keysOfUpdateData = Object.keys(data);
    let dataParameterUpdateData = [];
    

    for (let index = 0; index < keysOfUpdateData.length; index++) {
        dataParameterUpdateData.push(data[keysOfUpdateData[index]]);
    }

    
    return new Promise((resolve, reject) => {
        connection.query(queries.delUpdateById(data), [...dataParameterUpdateData, id], (error, result, fields) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
}



let getMonthNameById = async (monthId = "") => {
    return new Promise((resolve, reject) => {
        connectionHostelPool.query(queries.getMonthNameById(), [monthId], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}











module.exports = {
    getUserByEmail,
    addNew,
    addNewMember,
    addNewAdmin,
    getAdmin,
    getMember,
    getList,
    getActiveList,
    getById,
    getDataByType,
    updateById,
    delUpdateById,
    getMonthNameById,
    getUserByPhone,
    getUserByNid
}

