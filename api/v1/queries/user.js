// const isEmpty = require("is-empty");
let table_name = "hostel";





let getUserByEmail = () => {
    return `SELECT id , name, email , phone , status, role,FROM ${table_name} where  email = ? and status <> 0 `;
}


let getUserByPhone = () => {
    return `SELECT id , name, email , phone , status, role FROM ${table_name} where  phone = ? and status <> 0 `;
}





let addNewUser = () => {
    return `INSERT INTO ${table_name} SET ?`;
}














module.exports = {
    
    
  
    getUserByEmail,
    getUserByPhone,

    addNewUser
    
}