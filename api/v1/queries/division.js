let table_name = "divisions";





let getComponentNameById = () => {
    return `SELECT type_name FROM ${table_name} where  id = ? and status != 0`;
}



let getByTypeName = () => {
    return `SELECT * FROM ${table_name} where type_name = ? and status != 0`;
}



let addNew = () => {
    return `INSERT INTO ${table_name} SET ?`;
}


let getList = () => {
    return `SELECT * FROM ${table_name}  where status != 0`;
}


let getActiveList = () => {
    return `SELECT * FROM ${table_name}  where status = 1`;
}


let getById = () => {
    return `SELECT id,name FROM ${table_name} where  id = ? and status != 0`;
}


let getMatchId = () => {
    return ` SELECT district.id, district.name
    FROM division
    JOIN district ON division.id = district.division_id
    WHERE division.id = division_id and status != 0`;
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
    getByTypeName,
    addNew,
    getList,
    getActiveList,
    getById,
    getDataByType,
    updateById,
    delUpdateById,
    getComponentNameById,
    getMatchId
    
}