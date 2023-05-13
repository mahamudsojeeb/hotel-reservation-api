const isEmpty = require('is-empty');
const { connectionHostelMYSQL } = require('../connections/connection');
const queries = require('../queries/member');


let addNewMember = async (info = {}, conn) => {
    let connection = connectionHostelMYSQL;
    if (conn !== undefined) connection = conn;


        return new Promise((resolve, reject) => {
            connection.query(queries.addNewMember(), [info], (error, result, fields) => {
                if (error) reject(error)
                else resolve(result)
            });
        });
       
}

let addNewAdmin = async (info = {}, conn) => {
    let connection = connectionHostelMYSQL;
    if (conn !== undefined) connection = conn;


        return new Promise((resolve, reject) => {
            connection.query(queries.addNewAdmin(), [info], (error, result, fields) => {
                if (error) reject(error)
                else resolve(result)
            });
        });
       
}
let addUser = async (info = {}, conn) => {
    let connection = connectionHostelMYSQL;
    if (conn !== undefined) connection = conn;


        return new Promise((resolve, reject) => {
            connection.query(queries.addUser(), [info], (error, result, fields) => {
                if (error) reject(error)
                else resolve(result)
            });
        });
       
}

module.exports = {
    
    addNewMember,
    addUser,
    addNewAdmin

    
}