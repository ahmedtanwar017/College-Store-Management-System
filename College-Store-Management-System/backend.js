import mysql from 'mysql2'
import dotenv from 'dotenv'
import { createReadStream } from 'fs'; // Importing fs module with promise-based functions
import csvParser from 'csv-parser';

dotenv.config()


const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()



//CSV

export async function parseAndInsertCSV(csvFilePath,table) {
    // const connection = await mysql.createConnection(pool);

    return new Promise((resolve, reject) => {
        createReadStream(csvFilePath)
            .pipe(csvParser())
            .on('data', async (row) => {
                try {
                    // Insert data into MySQL table
                    const sql = `INSERT INTO ${table} SET ?`;
                    await pool.query(sql, row);
                } catch (error) {
                    reject(error);
                }
            })
            .on('end', async () => {
                resolve();
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}


//LOGIN

export async function insertLogin(email_id,password,name,role){
    await pool.query(`INSERT IGNORE INTO Login (email_id,pass_word,name,role) VALUES (?,?,?,?)`,[email_id,password,name,role])
}

export async  function checkauth(email_id){
    const [result] = await pool.query(`SELECT * FROM login WHERE email_id = ?`,[email_id])
    return result
}

export async function getInfo(name){
    const [result] = await pool.query(`SELECT  * FROM Login WHERE name = ?`,[name]);
    return result
}

export async function changePassword(email_id,new_password){
    const [result] = await pool.query(`UPDATE Login
    SET pass_word = ?
    WHERE email_id = ? `,[new_password,email_id]);
    return result
}




// DEPARTMENTS



export async function DepartmentNames(){
    const [result] = await pool.query("SELECT Department_name FROM Department_Store ORDER BY Department_name ASC")
    return result;
}
export async function getDepartments(){
    const [result] = await pool.query("SELECT * FROM department_store ORDER BY Department_id ASC")
    if(result.length === 0) {return "No result in database.";}
    else{
    const columnNames = Object.keys(result[0]);
    return [columnNames,result]
}
}
export async function getDepartment(id){
    const [result] = await pool.query(`SELECT * 
    FROM Department_Store
    WHERE Department_id = ?`,[id])
    if(result.length === 0) {return "No result in database.";}
    else{
    const columnNames = Object.keys(result[0]);
    return [columnNames,result]
}
}
export async function insertDepartment(department_id,email_id,department_name){
    await pool.query(`INSERT IGNORE INTO department_store (department_id,email_id,department_name) VALUES (?,?,?)`,[department_id,email_id,department_name])
}

// PRODUCTS

export async function ProductNames(){
    const [result] = await pool.query("SELECT Product_name FROM Products ORDER BY Product_name ASC")
    return result;
}
export async function orders(){
    const [result] = await pool.query("SELECT * FROM orders")
    return result;
}
export async function ProductNamesId(){
    const [result] = await pool.query("SELECT Product_id,Product_name FROM Products ORDER BY Product_id ASC")
    return result;
}

export async function getProducts(){
    const [result] = await pool.query("SELECT * FROM Products ORDER BY Product_id ASC")
    if(result.length === 0) {return "No result in database.";}
    else{
    const columnNames = Object.keys(result[0]);
    return [columnNames,result]
}
}
export async function getProduct(id){
    const [result] = await pool.query(`SELECT * 
    FROM Product
    WHERE Product_id = ?`,[id])
    if(result.length === 0) {return "No result in database.";}
    else{
    const columnNames = Object.keys(result[0]);
    return [columnNames,result]
    }
}
export async function insertProduct(Product_name){
    await pool.query(`INSERT ignore INTO Products (Product_name) values (?)`,[Product_name])
}

export async function deleteProduct(Product_name){
    await pool.query(`DELETE FROM Products WHERE Product_name = ? `,[Product_name])
}

export async function filteredProduct(product_name){
    const [result] = await pool.query(`SELECT * FROM availablemainstock WHERE Product_name = ? `,[product_name])
    if(result.length === 0) {return "No products in database."}
    else{
    const columnNames = Object.keys(result[0]);
    return [columnNames,result]
}
}



//Ledger

export async function insertLedger(Product_name){
    await pool.query(`INSERT ignore INTO Ledger (Ledger_name) values (?)`,[Product_name])
}

export async function LedgerNames(){
    const [result] = await pool.query("SELECT Ledger_name FROM Ledger ORDER BY Ledger_name ASC")
    return result;
}

export async function LedgerNamesId(){
    const [result] = await pool.query("SELECT Ledger_id,Ledger_name FROM Ledger ORDER BY Ledger_id ASC")
    return result;
}
export async function deleteLedger(Product_name){
    await pool.query(`DELETE FROM Ledger WHERE Ledger_name = ? `,[Product_name])
}

export async function filteredLedger(product_name){
    const [result] = await pool.query(`SELECT * FROM availabledsstock WHERE Product_name = ? `,[product_name])
    if(result.length === 0) {return "No products in database."}
    else{
    const columnNames = Object.keys(result[0]);
    return [columnNames,result]
}
}


// STAFF


export async function StaffNames(){
    const [result] = await pool.query("SELECT Staff_name FROM Staff ORDER BY Staff_name ASC")
    return result;
}
export async function getStaffInfo(){
    const [result] = await pool.query("SELECT * FROM Staff ORDER BY Staff_id ASC")
    if(result.length === 0) {return "No result in database.";}
    else{
    const columnNames = Object.keys(result[0]);
    return [columnNames,result]
    }
}
export async function getStaff(id){
    const [result] = await pool.query(`SELECT * 
    FROM Staff
    WHERE Staff_id = ?`,[id])
    if(result.length === 0) {return "No result in database.";}
    else{
    const columnNames = Object.keys(result[0]);
    return [columnNames,result]
    }
}
export async function insertStaffInfo(Staff_id,email_id,Staff_name){
    await pool.query(`INSERT IGNORE INTO Staff (Staff_id,email_id,Staff_name) VALUES (?,?,?)`,[Staff_id,email_id,Staff_name])
}





// LAB

export async function LabNames(){
    const [result] = await pool.query("SELECT Lab_name FROM Lab ORDER BY Lab_name ASC")
    return result;
}
export async function getLabInfo(){
    const [result] = await pool.query("SELECT * FROM Lab ORDER BY Lab_id ASC")
    if(result.length === 0) {return "No result in database.";}
    else{
    const columnNames = Object.keys(result[0]);
    return [columnNames,result]
    }
}
export async function getLab(id){
    const [result] = await pool.query(`SELECT * 
    FROM Lab
    WHERE Lab_id = ?`,[id])
    if(result.length === 0) {return "No result in database.";}
    else{
    const columnNames = Object.keys(result[0]);
    return [columnNames,result]
    }
}
export async function insertLabInfo(Lab_id,email_id,Lab_name){
    await pool.query(`INSERT IGNORE INTO Lab (Lab_id,email_id,Lab_name) VALUES (?,?,?)`,[Lab_id,email_id,Lab_name])
}













// DS_REQ_MAIN
export async  function updateDSHOD(request_id){  
    await pool.query(`UPDATE ds_req_main
    SET status = "approved by HOD"
    WHERE request_id = ?;
    `,[request_id])
  }

  export async  function updateDSPrincipal(request_id){  
    await pool.query(`UPDATE ds_req_main
    SET status = "approved by Principal"
    WHERE request_id = ?;
    `,[request_id])
  }

  export async  function updateDSSupply(request_id){  
    await pool.query(`UPDATE ds_req_main
    SET status = "supplying"
    WHERE request_id = ?;
    `,[request_id])
  }

  export async  function rejectDSRequest(request_id){  
    await pool.query(`UPDATE ds_req_main
    SET status = "rejected"
    WHERE request_id = ?;
    `,[request_id])
  }
  export async  function rejectDSRequestPrincipal(request_id){  
    await pool.query(`UPDATE ds_req_main
    SET status = "rejected by Principal"
    WHERE request_id = ?;
    `,[request_id])
  }
  export async  function rejectDSRequestHOD(request_id){  
    await pool.query(`UPDATE ds_req_main
    SET status = "rejected by HOD"
    WHERE request_id = ?;
    `,[request_id])
  }

export async function insertReq_Main(Department_name,product_type,Product_name,quantity,product_description,remark,requested_by){
    await pool.query(`INSERT INTO ds_req_main (Department_name,product_type,Product_name,quantity,product_description,status,remark,requested_by) VALUES (?,?,?,?,?,"pending",?,?)`,[Department_name,product_type,Product_name,quantity,product_description,remark,requested_by])
}

export async function getDSRequests(name){
    const [result] = await pool.query(`SELECT * 
    FROM ds_req_main
    WHERE department_name = ? AND status = "pending" OR status = "supplying"
    ORDER BY requested_at DESC `,[name])
    if(result.length === 0) {return "No result in database.";}
    else{
    const columnNames = Object.keys(result[0]);
    return [columnNames,result]
    }
}
export async function getDSRequestsHOD(name){
    const [result] = await pool.query(`SELECT * 
    FROM ds_req_main
    WHERE department_name = ? AND status = "pending"
    ORDER BY requested_at DESC `,[name])
    if(result.length === 0) {return "No result in database.";}
    else{
    const columnNames = Object.keys(result[0]);
    return [columnNames,result]
    }
}
export async function getDSRequestsR(name){
    const [result] = await pool.query(`SELECT * 
    FROM ds_req_main
    WHERE department_name = ? 
    ORDER BY requested_at DESC `,[name])
    if(result.length === 0) {return "No result in database.";}
    else{
    const columnNames = Object.keys(result[0]);
    return [columnNames,result]
    }
}
export async function getAllDSRequests(name){
    const [result] = await pool.query(`SELECT * 
    FROM ds_req_main
    WHERE department_name = ?
    ORDER BY requested_at DESC `,[name])
    if(result.length === 0) {return "No result in database.";}
    else{
    const columnNames = Object.keys(result[0]);
    return [columnNames,result]
    }
}
export async function getDSRequestsMain(){
    const [result] = await pool.query(`SELECT * 
    FROM DS_Req_Main_With_Available_Quantity
    WHERE status = "approved by Principal"
    ORDER BY requested_at DESC `)
    if(result.length === 0) {return "No result in database.";}
    else{
    const columnNames = Object.keys(result[0]);
    return [columnNames,result]
    }
}
export async function getDSRequestsMainR(){
    const [result] = await pool.query(`SELECT * 
    FROM ds_req_main
    WHERE status = "approved by Principal" OR status = "approved" OR status ="supplying"
    ORDER BY requested_at DESC `)
    if(result.length === 0) {return "No result in database.";}
    else{
    const columnNames = Object.keys(result[0]);
    return [columnNames,result]
    }
}

export async function getDSRequestsMainPrincipal(){
    const [result] = await pool.query(`SELECT * 
    FROM ds_req_main
    WHERE status = "approved by HOD"
    ORDER BY requested_at DESC `)
    if(result.length === 0) {return "No result in database.";}
    else{
    const columnNames = Object.keys(result[0]);
    return [columnNames,result]
    }
}
export async function getDSRequestsMainPrincipalR(){
    const [result] = await pool.query(`SELECT * 
    FROM ds_req_main
    WHERE status !="approved"
    ORDER BY requested_at DESC `)
    if(result.length === 0) {return "No result in database.";}
    else{
    const columnNames = Object.keys(result[0]);
    return [columnNames,result]
    }
}
export async function getAllDSRequestsMain(){
    const [result] = await pool.query(`SELECT * 
    FROM ds_req_main
    ORDER BY requested_at DESC `)
    if(result.length === 0) {return "No result in database.";}
    else{
    const columnNames = Object.keys(result[0]);
    return [columnNames,result]
    }
}
export async function getDSRequestsProduct() {
    const [result] = await pool.query(`
        SELECT product_name, SUM(quantity) AS total_quantity
        FROM ds_req_main
        WHERE status = "pending"
        GROUP BY product_name
    `)
    if(result.length === 0) {return "No result in database.";}
    else{
    const columnNames = Object.keys(result[0]);
    return [columnNames,result]
    }
};



// SL_REQ_DS


export async  function rejectSLRequest(request_id){  
    await pool.query(`UPDATE sl_req_ds
    SET status = "rejected"
    WHERE request_id = ?;
    `,[request_id])
  }


export async function insertstaff_req(Department_name,product_type,Product_name,Product_description,quantity,purpose,Name,remark){
    await pool.query(`INSERT INTO sl_req_ds (Department_name,product_type,Product_name,Product_description,quantity,purpose,Name,status,remark) VALUES (?,?,?,?,?,?,?,"pending",?)`,[Department_name,product_type,Product_name,Product_description,quantity,purpose,Name,remark])
}

export async function getSLRequests(name){
    const [result] = await pool.query(`SELECT * 
    FROM sl_req_ds
    WHERE name = ? AND (status = "pending" OR status = "supplying")
    ORDER BY requested_at DESC `,[name])
    if(result.length === 0) {return "No result in database.";}
    else{
    const columnNames = Object.keys(result[0]);
    return [columnNames,result]
    }
}
export async function getAllSLRequests(name){
    const [result] = await pool.query(`SELECT * 
    FROM sl_req_ds
    WHERE name = ? 
    ORDER BY requested_at DESC `,[name])
    if(result.length === 0) {return "No result in database.";}
    else{
    const columnNames = Object.keys(result[0]);
    return [columnNames,result]
    }
}
export async function getAllSLRequestsR(name){
    const [result] = await pool.query(`SELECT * 
    FROM sl_req_ds
    WHERE department_name = ? 
    ORDER BY requested_at DESC `,[name])
    if(result.length === 0) {return "No result in database.";}
    else{
    const columnNames = Object.keys(result[0]);
    return [columnNames,result]
    }
}

export async function getSLRequestsDS(name){
    const [result] = await pool.query(`SELECT * 
    FROM sl_req_ds_with_available_quantity
    WHERE department_name = ? AND (status = "pending" OR status = "supplying")
    ORDER BY requested_at DESC `,[name])
    if(result.length === 0) {return "No result in database.";}
    else{
    const columnNames = Object.keys(result[0]);
    return [columnNames,result]
    }
}
export async function getAllSLRequestsDS(name){
    const [result] = await pool.query(`SELECT * 
    FROM sl_req_ds
    WHERE department_name = ?"
    ORDER BY requested_at DESC `,[name])
    if(result.length === 0) {return "No result in database.";}
    else{
    const columnNames = Object.keys(result[0]);
    return [columnNames,result]
    }
}

export async function getSLRequestsProduct(name) {
    const [result] = await pool.query(`
        SELECT product_name, SUM(quantity) AS total_quantity
        FROM sl_req_ds
        WHERE status = "pending" AND department_name = ?
        GROUP BY product_name
    `,[name]);
    
    // Extract column names from the result object
    if(result.length === 0) {return "No result in database.";}
    else{
    const columnNames = Object.keys(result[0]);
    return [columnNames,result]
    }
}




// STOCK 


export async function insertMainStock(product_type,product_name,product_description,quantity,amount,name_of_supplier){
    await pool.query(`INSERT INTO Stock (product_type,Product_name,Product_description,quantity,amount,name_of_supplier,status) VALUES (?,?,?,?,?,?,"available")`,[product_type,product_name,product_description,quantity,amount,name_of_supplier])
}

export async function getMainStock() {
    const [result] = await pool.query(`SELECT *  FROM AvailableMainStock`);
    if(result.length === 0) {return "No stock available.";}
    else{
    const columnNames = Object.keys(result[0]);
    return [columnNames,result]
}
}
export async function getAllMainStock() {
    const [result] = await pool.query(`SELECT *  FROM Stock`);
    if(result.length === 0) {return "No stock available.";}
    else{
    const columnNames = Object.keys(result[0]);
    return [columnNames,result]
}
}



//  DS STOCK

export async function insertDSStock(bill_no, inward_no, deadstock_no) {
    try {
        await pool.query(`
            UPDATE supplyingDS
            SET
                Inward_no = COALESCE(Inward_no, ?),
                bill_no = COALESCE(bill_no, ?),
                deadstock_no = COALESCE(deadstock_no, ?)
            WHERE
                Inward_no IS NULL AND bill_no IS NULL AND deadstock_no IS NULL
        `, [inward_no, bill_no, deadstock_no]);

        console.log('Null values updated successfully');
    } catch (error) {
        console.error('Error updating null values:', error);
    }
}



export async function getDSStock(name) {
    const [result] = await pool.query(`SELECT *  FROM AvailableDSStock
    WHERE Department_name = ?`,[name]);
    if(result.length === 0) {return "No stock available.";}
    else{
    const columnNames = Object.keys(result[0]);
    return [columnNames,result]
}
}

export async function getAllDSStock(name) {
    const [result] = await pool.query(`SELECT *  FROM suppliedds
    WHERE Department_name = ?`,[name]);
    if(result.length === 0) {return "No stock available.";}
    else{
    const columnNames = Object.keys(result[0]);
    return [columnNames,result]
}
}


// SUPPLYING DS

export async function insertSupplyingDS(request_id){
    await pool.query(`INSERT IGNORE INTO SupplyingDS(Approved_id) VALUES (?)`,[request_id])
}


// SUPPLIED DS
export async function insertSuppliedDS(request_id){
    await pool.query(`INSERT INTO suppliedDS (Approved_id, stock_ref_id, department_name, product_type, Product_name, Product_description, quantity, supplied_quantity, amount, status, bill_no, Inward_no, deadstock_no, recieved_at, name_of_supplier)
    SELECT Approved_id, item_id, department_name, product_type, Product_name, Product_description, quantity, 0, amount, 'available', bill_no, Inward_no, deadstock_no, CURRENT_TIMESTAMP, name_of_supplier
    FROM supplyingDS  
    WHERE Approved_id = ?`,[request_id])
}

export async function deleteSupplyingDS(request_id){
    await pool.query(`DELETE FROM supplyingDS
    WHERE Approved_id = ?`,[request_id])
}
export async  function updateDS(request_id){  
    await pool.query(`UPDATE ds_req_main
    SET status = "approved"
    WHERE request_id = ?;
    `,[request_id])
  }



//  SUPPLYING SL

export async function insertSupplyingSL(request_id){
    await pool.query(`INSERT IGNORE INTO SupplyingSL(Approved_id) VALUES (?)`,[request_id])
}


// SUPPLIED SL

export async function insertSuppliedSL(request_id){
    await pool.query(`INSERT INTO suppliedSL (Approved_id, stock_ref_id, ds_item_id, department_name, name, product_type, Product_name, Product_description, quantity, amount, bill_no, Inward_no, deadstock_no, name_of_supplier)
    SELECT Approved_id, stock_ref_id, ds_item_id, department_name, name, product_type, Product_name, Product_description, quantity, amount, bill_no, Inward_no, deadstock_no, name_of_supplier
    FROM supplyingSL
    WHERE Approved_id = ?`,[request_id])
}

export async function deleteSupplyingSL(request_id){
    await pool.query(`DELETE FROM supplyingSL
    WHERE Approved_id = ?`,[request_id])
}

export async  function updateSL(request_id){  
    await pool.query(`UPDATE sl_req_ds
    SET status = "approved"
    WHERE request_id = ?;
    `,[request_id])
  }

  export async  function updateSLSupply(request_id){  
    await pool.query(`UPDATE sl_req_ds
    SET status = "supplying"
    WHERE request_id = ?;
    `,[request_id])
  }


export async function displayChartDSFC(name,start,end){
            let query = `SELECT product_name, SUM(quantity) AS total_quantity , SUM(amount) AS total_amount
                    FROM suppliedds `;

        const queryParams = [name];

        if (start && end) {
            query += ` WHERE Department_name = ? AND product_type ="consumable" AND YEAR(recieved_at) BETWEEN ? AND ?`;
            queryParams.push(start, end);
        } else {
            query += ` WHERE Department_name = ? AND product_type ="consumable"`;
        }

        query += ` GROUP BY product_name`;

        const [result] = await pool.query(query, queryParams);
        return result;

 }

 export async function displayChartDSFN(name,start,end){
    let query = `SELECT product_name, SUM(quantity) AS total_quantity , SUM(amount) AS total_amount
            FROM suppliedds `;

const queryParams = [name];

if (start && end) {
    query += ` WHERE Department_name = ? AND product_type ="non-consumable" AND YEAR(recieved_at) BETWEEN ? AND ?`;
    queryParams.push(start, end);
} else {
    query += ` WHERE Department_name = ? AND product_type ="non-consumable"`;
}

query += ` GROUP BY product_name`;

const [result] = await pool.query(query, queryParams);
return result;

}




export async function displayChartSLFC(name,start,end){
    let query = `SELECT product_name, SUM(quantity) AS total_quantity , SUM(amount) AS total_amount
            FROM suppliedsl `;

const queryParams = [name];

if (start && end) {
    query += ` WHERE name = ? AND product_type ="consumable" AND YEAR(recieved_at) BETWEEN ? AND ?`;
    queryParams.push(start, end);
} else {
    query += ` WHERE name = ? AND product_type ="consumable"`;
}

query += ` GROUP BY product_name`;

const [result] = await pool.query(query, queryParams);
return result;

}


export async function displayChartSLFN(name,start,end){
    let query = `SELECT product_name, SUM(quantity) AS total_quantity , SUM(amount) AS total_amount
            FROM suppliedsl `;

const queryParams = [name];

if (start && end) {
    query += ` WHERE name = ? AND product_type ="non-consumable" AND YEAR(recieved_at) BETWEEN ? AND ?`;
    queryParams.push(start, end);
} else {
    query += ` WHERE name = ? AND product_type ="non-consumable"`;
}

query += ` GROUP BY product_name`;

const [result] = await pool.query(query, queryParams);
return result;

}









 export async function displayChartStockFN(start,end){
            let query = `SELECT product_name, SUM(quantity) AS total_quantity ,SUM(amount) AS total_amount
                    FROM stock`;

        const queryParams = [];

        if (start && end) {
            query += ` WHERE product_type ="non-consumable" AND YEAR(created_at) BETWEEN ? AND ?`;
            queryParams.push(start, end);
        }else{
            query += ` WHERE product_type ="non-consumable"`
        }

        query += ` GROUP BY product_name`;

        const [result] = await pool.query(query, queryParams);
        return result;
 }

 export async function displayChartStockFC(start,end){
    let query = `SELECT product_name, SUM(quantity) AS total_quantity ,SUM(amount) AS total_amount
            FROM stock`;

const queryParams = [];

if (start && end) {
    query += ` WHERE product_type ="consumable" AND YEAR(created_at) BETWEEN ? AND ?`;
    queryParams.push(start, end);
}else{
    query += ` WHERE product_type ="consumable"`
}

query += ` GROUP BY product_name`;

const [result] = await pool.query(query, queryParams);
return result;
}


export async function getAllSLStock(name) {
    const [result] = await pool.query(`SELECT *  FROM suppliedsl
    WHERE name = ?`,[name]);
    if(result.length === 0) {return "No stock available.";}
    else{
    const columnNames = Object.keys(result[0]);
    return [columnNames,result]
}
}