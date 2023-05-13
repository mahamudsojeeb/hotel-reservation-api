let table_name = "mtl_super_admins";
let table_name2 ="mtl_members"
let table_name3="mtl_users"




let getComponentNameById = () => {
    return `SELECT type_name FROM ${table_name} where  id = ? and status != 0`;
}



let getUserByEmail = () => {
    return `SELECT * FROM ${table_name} where email = ? and status != 0`;
}

let getUserByPhone = () => {
    return `SELECT * FROM ${table_name3} where phone = ? and status != 0`;
}
let getAdmin = () => {
    return `SELECT * FROM ${table_name} where phone = ? and status != 0`;
}
let getMember = () => {
    return `SELECT * FROM ${table_name2} where phone = ? and status != 0`;
}

let getUserByNid = () => {
    return `SELECT * FROM ${table_name2} where nid = ? and status != 0`;
}


let addNew = () => {
    return `INSERT INTO ${table_name} SET ?`;
}
let addNewMember = () =>{
    return `INSERT INTO ${table_name2} SET ?`;
}
let addNewAdmin =()=>{
    return `INSERT INTO ${table_name} SET ?`;

}
let addUser = () =>{
    return `INSERT INTO ${table_name3} SET ?`
}


let getList = () => {
    return `SELECT * FROM ${table_name}  where status != 0`;
}


let getActiveList = () => {
    return `SELECT * FROM ${table_name}  where status = 1`;
}


let getById = () => {
    return `SELECT * FROM ${table_name} where  id = ? and status != 0`;
}


let getDataByType = () => {
    return `SELECT * FROM ${table_name} where  type_name = ? and status != 0`;
}


let updateById = (data) => {
    let keys = Object.keys(data);

    let query = `update ${table_name} set ` + keys[0] + ` = ? `;
    

    for (let i = 1; i < keys.length; i++) {
        query += `, ` + keys[i] + ` = ? `;
    }
   
    query += `where id = ? `;
    
    return query;
}


let delUpdateById = (data) => {
    let keys = Object.keys(data);

    let query = `update ${table_name} set ` + keys[0] + ` = ? `;
    

    for (let i = 1; i < keys.length; i++) {
        query += `, ` + keys[i] + ` = ? `;
    }
   
    query += `where id = ? `;
    
    
    return query;
}




module.exports = {
    getUserByEmail,
    addNew,
    addNewMember,
    addNewAdmin,
    getAdmin,
    getMember,
    addUser,
    getList,
    getActiveList,
    getById,
    getDataByType,
    updateById,
    delUpdateById,
    getComponentNameById,
    getUserByPhone,
    getUserByNid
    
}