const { connectionHostelPool } = require('../connections/connection');
const queries = require('../queries/bill');





let getByTypeName = async (type_name = "") => {
    return new Promise((resolve, reject) => {
        connectionHostelPool.query(queries.getByTypeName(), [type_name], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}



let addNew = async (users_id,months_id,component_type_id,amount,year) => {
    return new Promise((resolve, reject) => {
        connectionHostelPool.query(queries.addNew(), [users_id,months_id,component_type_id,amount,year], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
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


let getDataByType = async (users_id = "") => {
    return new Promise((resolve, reject) => {
        connectionHostelPool.query(queries.getDataByType(), [users_id], (error, result, fields) => {
            if (error) reject(error)
            else resolve(result)
        });
    });
}






let updateById = async (id = 0, data = {}, conn = undefined) => {

    
    let connection = connectionHostelPool;
    if (conn !== undefined) connection = conn;
    

    let keysOfUpdateData = Object.keys(data);
    
    let dataParameterUpdateData = [];

    for (let index = 0; index < keysOfUpdateData.length; index++) {
        dataParameterUpdateData.push(data[keysOfUpdateData[index]]);
    }

    console.log(dataParameterUpdateData)
    return new Promise((resolve, reject) => {
        connection.query(queries.updateById(data), [...dataParameterUpdateData, id], (error, result, fields) => {
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















module.exports = {
    getByTypeName,
    addNew,
    getList,
    getActiveList,
    getById,
    getDataByType,
    updateById,
    delUpdateById
}