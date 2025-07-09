import express from 'express';
// import { getDepartments,getDepartment,insertDepartment, insertProduct,getProduct,getProducts,getStaff,getStaffInfo,insertStaffInfo,deleteProduct,checkauth,insertReq_Main,insertstaff_req} from './backend.js';
import bcrypt from 'bcrypt';
import multer from 'multer';
import fs from 'fs/promises';
import fetch from 'node-fetch';
import * as backenFunctions from './backend.js'
import { dataToExcel } from './excel.js';
import path from 'path';
import { __filename, __dirname } from './dirname.js';
import bodyParser from 'body-parser';
import session from 'express-session';
import crypto from 'crypto';

const port = 5501;
// Function to generate a secure random string (secret key)
function generateSecretKey(length) {
    return crypto.randomBytes(length).toString('hex');
}
// Generate a 32-byte (256-bit) secret key
const secretKey = generateSecretKey(32);

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
// Configure session middleware with the generated secret key
app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: true
}));

const upload = multer({ dest: 'uploads/' });

// Custom error class for MySQL-related errors
// class DatabaseError extends Error {
//   constructor(message) {
//     super(message);
//     this.name = 'DatabaseError';
//   }
// }

// // Error handling middleware
// function errorHandler(err, req, res, next) {
//   if (err instanceof DatabaseError) {
//     console.error('MySQL Error:', err.message);
//     res.status(500).json({ error: 'Database Error', message: err.message });
//   } else {
//     console.error('Internal Server Error:', err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

app.set("view engine","ejs");

// app.use(errorHandler);
app.use('/public', express.static(path.join(__dirname, 'public')));


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

function isAuthenticated(req, res, next) {
    if (req.session && req.session.Name) {
        return next();
    }
    res.redirect('/login'); // Redirect to login page if not authenticated
}

app.use((req, res, next) => {
  // Exclude login route from authentication check
  if (req.path === '/login'||req.path === '/'||req.path === '/change-password'||req.path === '/AboutUs'||req.path === '/Faqs') {
      return next();
  }
  isAuthenticated(req, res, next);
});

function authorize(permissions) {
    return function(req, res, next) {
      const userRole = req.session.userRole;
      if (permissions.includes(userRole)) {
          next(); 
      } else {
          res.sendFile(__dirname + '/403.html')
      }
    };
    }

//ERRORS

// app.use((req, res, next) => {
//   res.status(403).sendFile(__dirname + '/401.html');
// });

















//STATIC PAGES

app.get('/', (req,res)=>{
  res.sendFile(__dirname + '/public/Html/Home_page.html');
})
app.get('/AboutUs', (req,res)=>{
  res.sendFile(__dirname + '/public/Html/AboutUs.html');
})
app.get('/Faqs', (req,res)=>{
  res.sendFile(__dirname + '/public/Html/Faqs.html');
})

app.get('/Homepage',(req,res)=>{
  const userRole = req.session.userRole
  if(userRole == "Admin"){
    res.redirect("/MainStore")
  }else if(userRole == "StoreAdmin"){
    res.redirect("/Department")
  }else if(userRole == "Principal"){
    res.redirect("/Principal")
  }else if(userRole == "HOD"){
    res.redirect("/Head_of_Department")
  }else{
    res.redirect("/Staff-Lab")
  }
})
 
// authorize(["StoreAdmin","Admin"]) 
app.get( "/Products-Filter", (req, res)=>{
    res.sendFile(__dirname + '/public/Html/products.html')
})

app.get( "/Departments-Filter", authorize(["StoreAdmin","Admin"]) ,(req, res)=>{
  res.sendFile(__dirname + '/public/Html/departments.html')
})

app.get( "/Staff-Lab", authorize(["Staff","Lab Incharge"]) ,(req, res)=>{
  res.sendFile(__dirname + '/public/Html/staff_homepage.html')
})
app.get( "/Department", authorize(["StoreAdmin"]) ,(req, res)=>{
  res.sendFile(__dirname + "/public/Html/department_home_page.html");
})
app.get( "/Principal", authorize(["Principal"]) ,(req, res)=>{
  res.sendFile(__dirname + "/public/Html/principal.html");
})
app.get( "/Head_of_Department", authorize(["HOD"]) ,(req, res)=>{
  res.sendFile(__dirname + "/public/Html/HOD.html");
})
app.get( "/MainStore", authorize(["Admin"]) ,(req, res)=>{
  // res.sendFile(__dirname + '/public/Html/MainStoreHome.html');
  res.sendFile(__dirname + '/public/Html/mainStore.html');
})

app.get( "/dsStock", authorize(["StoreAdmin","Admin"]) ,(req, res)=>{
  res.sendFile(__dirname + "/public/Html/dsStock.html");
})

//LOGIN



app.get("/login", (req, res) => {
  const errorMessage = req.query.error ? 'Invalid credentials' : null;
  res.render('login', { errorMessage });
});

app.post("/login", async (req,res,error) => {
  const { email_id, password } = req.body;

  const user = await backenFunctions.checkauth(email_id);
  
  if(user.length !=0){
    const check = await bcrypt.compare(password.trim(),user[0].pass_word)
    if(check){
      req.session.userRole = user[0].role;
      req.session.Name = user[0].Name;
      res.redirect("/Homepage")
      
    }
    else{
      res.redirect('/login?error=true');
    }
  }
  else{
    res.redirect('/login?error=true');
  }
  
})

app.get("/change-password", (req, res) => {
  let errorMessage = null;
  if (req.query.error === 'invalid') {
    errorMessage = 'Invalid credentials';
  } else if (req.query.error === 'mismatch') {
    errorMessage = 'New password and confirm password do not match';
  } else if(req.query.error === "notfound"){
    errorMessage = 'Email Id not found';
  }
  res.render('change_password', { errorMessage });
});

app.post("/change-password", async(req, res) => {
  const { email_id, current_password,new_password,confirm_password } = req.body;
  const user  = await backenFunctions.checkauth(email_id);
  const check = await bcrypt.compare(user[0].pass_word,current_password)
  if(check){
    if(user[0].pass_word ==  current_password){
      if(new_password == confirm_password){
          const password = await bcrypt.hash(new_password, 13);
          await backenFunctions.changePassword(email_id,password)
          res.send("Password Changed Successfully");
      }else{
        res.redirect('/change-password?error=mismatch');
      }
    }else{
      res.redirect('/change-password?error=invalid');
    }
}else{
  console.log("not found")
  res.redirect('/change-password?error=notfound');
}
});







//PRODUCTS



app.get("/Products", async (req,res,error) =>{
  try{
      const [columns,Product] = await backenFunctions.getProducts();
      res.render('index',{data:Product,columns:columns})
  }
  catch{
      
      console.error(error);
      res.status(500).send("Internal Server Error");
  }
})
app.get("/Product/:id", async (req,res,error) =>{
  try{
      const id = +req.params.id
      const [columns,Product] = await backenFunctions.getProduct(id);
      res.render('index',{data:Product,columns:columns})
  }
  catch{
      
      console.error(error);
      res.status(500).send("Internal Server Error");
  }
})
app.post("/addProduct", async (req,res,error) =>{
  const productName = req.body
  console.log(productName)

  const receivedData = req.body; // Received data
console.log('Data received from client:', receivedData);
})

app.post("/Products-Filter", async(req,res,error) =>{
  const {productName} = req.body
  
    await backenFunctions.insertProduct(productName)
    
    res.redirect("/Products-Filter")
  // console.log(req.body)
  // res.status(201).send("Successfull")
  // console.log(productName)
})

app.delete("/Products-Delete", async(req,res,error)=>{
  const item = req.body
  await backenFunctions.deleteProduct(item.product_name)
  await backenFunctions.deleteLedger(item.product_name)
  res.status(204).send("Successfull")

})

app.get("/ProductNames", async(req,res)=>{
  const product = await backenFunctions.ProductNames()
  res.json(product)
})
app.get("/ProductNamesId", async(req,res)=>{
  const product = await backenFunctions.ProductNamesId()
  res.json(product)
})


app.get("/filteredProduct",authorize(["Admin","StoreAdmin"]) ,async(req, res) => {
  // Extract data from query parameters
  const product_name = req.query.product_name;
  const userRole = req.session.userRole
  
  if(userRole == "Admin"){

  const [columns, Request] = await backenFunctions.filteredProduct(product_name);
  
    res.render('DSStock',{data:Request,columns:columns})
  }else{
    const [columns, Request] = await backenFunctions.filteredProduct(product_name);
  
    res.render('DSStock',{data:Request,columns:columns})
  }
});


//LEDGER

app.get("/LedgerNames", async(req,res)=>{
  const ledger = await backenFunctions.LedgerNames()
  res.json(ledger)
})

app.get("/LedgerNamesId", async(req,res)=>{
  const ledger = await backenFunctions.LedgerNamesId()
  res.json(ledger)
})

app.delete("/Ledger-Delete", async(req,res,error)=>{
  const item = req.body
  await backenFunctions.deleteLedger(item.product_name)
  res.status(204).send("Successfull")

})

app.get("/filteredProduct", async(req, res) => {
  // Extract data from query parameters
  const product_name = req.query.product_name;
  const userRole = req.session.userRole
  
  // if(userRole == "Admin"){

  const [columns, Request] = await backenFunctions.filteredLedger(product_name);
  
    res.render('DS',{data:Request,columns:columns})
  // }
  // else{
  //   res.json("Later")
  // }
  // res.send("Successful")
});

app.post("/Ledger-Filter", async(req,res,error) =>{
  const {productName} = req.body
  
    await backenFunctions.insertLedger(productName)
    
    res.redirect("/Products-Filter")
  // res.status(201).send("Successfull")
  // console.log(productName)
})



//DEPARTMENTS



app.get("/Departments", async (req,res,error) =>{
    try{
        const [columns,department] = await backenFunctions.getDepartments();
        res.render('Request',{data:department,columns:columns})
        // console.table(departments)
    }
    catch{
        
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
  })
  app.get("/Department/:id", async (req,res,error) =>{
    try{
        const id = +req.params.id
        const [columns,department] = await backenFunctions.getDepartment(id);
        res.render('index',{data:department,columns:columns})
        // console.table(departments)
    }
    catch{
        
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
  })
  app.post("/Department", async (req,res,error) =>{
    try {
      const {Department_id,Department_name} = req.body;
      const department = await backenFunctions.insertDepartment(Department_id, Department_name);
      res.status(201).send(department);

    }catch{
        
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
  })

  app.get("/DepartmentNames", async(req,res)=>{
    const result = await backenFunctions.DepartmentNames()
    res.json(result)
  })

  app.get("/addDepartment",authorize(["Admin"]),async(req,res)=> {
    res.sendFile(__dirname + "/public/html/addDepartment.html")
  })

  app.post("/addDepartment",authorize(["Admin"]),async(req,res)=> {
    const {department_id,email_id}= req.body
    const user = await backenFunctions.checkauth(email_id);
    console.log(email_id)

    if(user.length !=0){
      const department_name = user[0].Name
      
     await backenFunctions.insertDepartment(department_id,email_id,department_name)
      // console.log(department_id,email_id,department_name)
    }else {
      console.log("email does not exist")
    }
    res.redirect('/addDepartment')
  })


  // STAFF




  app.get("/StaffInfo", authorize(["StoreAdmin","Admin"]),async (req,res,error) =>{
    try{
        const [columns,Staff] = await backenFunctions.getStaffInfo();
        // res.send(Staff)
        res.render('Request',{data:Staff,columns:columns})
    }
    catch{
        
        console.error(error);
        res.status(500).send("You don't have access to this page");
    }
  })
  app.get("/Staff/:id", async (req,res,error) =>{
    try{
        const id = +req.params.id
        const [columns,Staff] = await backenFunctions.getStaff(id);
        res.render('index',{data:Staff,columns:columns})
    }
    catch{
        
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
  })
  app.post("/Staff", async (req,res,error) =>{
    try {
      const {Staff_id,Staff_name} = req.body;
      await backenFunctions.insertStaffInfo(Staff_id,Staff_name);
      res.status(201).send("SUCCESFULL");
    }catch{
        
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
  })

  app.get("/StaffNames", async(req,res)=>{
    const product = await backenFunctions.StaffNames()
    res.json(product)
  })

  app.get("/addStaff",authorize(["Admin"]),async(req,res)=> {
    res.sendFile(__dirname + "/public/html/addStaff.html")
  })

  app.post("/addStaff",authorize(["Admin"]),async(req,res)=> {
    const {staff_id,email_id}= req.body
    const user = await backenFunctions.checkauth(email_id)
    if(user.length !=0){
      const staff_name = user[0].Name
      await backenFunctions.insertStaffInfo(staff_id,email_id,staff_name)
    }else {
      console.log("email does not exist")
    }
    res.redirect('/addStaff')
  })



//LAB

app.get("/LabNames", async(req,res)=>{
  const Names = await backenFunctions.LabNames()
  res.json(Names)
})


app.get("/addLab",authorize(["Admin"]),async(req,res)=> {
  res.sendFile(__dirname + "/public/html/addLab.html")
})

app.post("/addLab",authorize(["Admin"]),async(req,res)=> {
  const {lab_id,email_id}= req.body
  const user = await backenFunctions.checkauth(email_id)
  if(user.length!=0){
    const lab_name = user[0].Name
    await backenFunctions.insertLabInfo(lab_id,email_id,lab_name)
    
  }else {
    console.log("email does not exist")
  }
  res.redirect('/addLab')
})


// FORM



  app.get('/form', async (req, res) => {
    const products = await backenFunctions.getProducts();
    // res.render('addProduct', { products: products[1] });
    res.render('add',{ products: products[1] })
    // res.send(products[1]);
});



  // app.get('/req_main',authorize(["StoreAdmin"]), async(req,res)=>{
  //   res.sendFile(__dirname + "/public/Html/store_req_main.html")
  // })
  // app.post('/req_main',authorize(["StoreAdmin"]), async(req,res)=>{
  //   const Department_name = req.session.Name
  //   const {Product_name,quantity,requested_by,requested_at} = req.body
  //   await backenFunctions.insertReq_Main(Department_name,Product_name,quantity,requested_by,requested_at)
  //   res.status(201).send("SUCCESFULL");
  // })





  app.get("/req",authorize(["Staff","Lab Incharge","StoreAdmin"]),async(req,res)=>{
    const userRole=req.session.userRole
    if(userRole == "Staff" || userRole == "Lab Incharge"){
        res.sendFile(__dirname + "/public/Html/staff_req.html")
    }else{
      res.sendFile(__dirname + "/public/Html/store_req_main.html")
    }
  })



  app.post("/req" ,authorize(["Staff","Lab Incharge","StoreAdmin"]) ,async(req,res)=>{
    const Name = req.session.Name
    const userRole = req.session.userRole
    let message = "Request Submitted Successfully"
    if(userRole == "Staff" || userRole == "Lab Incharge"){
      const {Department_name,product_type,Product_name,Product_description,quantity,purpose,remark} = req.body
      await backenFunctions.insertstaff_req(Department_name,product_type,Product_name,Product_description,quantity,purpose,Name,remark)
    }else{
      const {product_type,Product_name,quantity,product_description,remark,requested_by} = req.body;
      await backenFunctions.insertReq_Main(Name,product_type,Product_name,quantity,product_description,remark,requested_by)
      // res.status(201).send(`<script>alert("${message}"); window.location.href='/';</script>`);
    }
    // res.status(201).send(`<script>alert("${message}");  fetch('/Homepage');</script>`);
    res.redirect("/Homepage")
  })
  

  // app.get("/check_req",async(req,res)=>{
  //   res.sendFile(__dirname + "/public/Html/check_req.html")
  // })
  app.get("/check_status",authorize(["Staff","Lab Incharge","StoreAdmin","Admin"]),async(req,res)=>{
      const name = req.session.Name
      const userRole = req.session.userRole
      if(userRole == "StoreAdmin"){
        const [columns,Request]  =  await backenFunctions.getDSRequests(name);
        res.render('SL',{data:Request,columns:columns})
      }else if(userRole == "Staff" || userRole == "Lab Incharge"){
      const [columns,Request]  =  await backenFunctions.getSLRequests(name);
      res.render('SL',{data:Request,columns:columns})
    }
      })
  

      app.get("/see_all_req",authorize(["Staff","Lab Incharge","StoreAdmin"]),async(req,res)=>{
        const name = req.session.Name
        const userRole = req.session.userRole
        if(userRole == "StoreAdmin"){
          const [columns,Request]  =  await backenFunctions.getAllDSRequests(name);
          res.render('Request',{data:Request,columns:columns})
        }else if(userRole == "Staff" || userRole == "Lab Incharge"){
        const [columns,Request]  =  await backenFunctions.getAllSLRequests(name);
        res.render('Request',{data:Request,columns:columns})
      }
        })

    app.get("/check_recieved_req",authorize(["StoreAdmin","Admin","Principal","HOD"]),async(req,res)=>{
        const userRole = req.session.userRole
        const name = req.session.Name
        if(userRole=="Admin"){
          const [columns,Request]  =  await backenFunctions.getDSRequestsMain();
          res.render('DS',{data:Request,columns:columns})
        }else if( userRole=="Principal"){
          const [columns,Request]  =  await backenFunctions.getDSRequestsMainPrincipal();
          res.render('DS',{data:Request,columns:columns})
        }else if( userRole=="HOD"){
          const [columns,Request]  =  await backenFunctions.getDSRequestsHOD(name);
          res.render('DS',{data:Request,columns:columns})
        }else{
          const [columns,Request]  =  await backenFunctions.getSLRequestsDS(name);
          res.render('DS',{data:Request,columns:columns})
        }
        
    })


    app.get("/check_allrecieved_req",authorize(["StoreAdmin","Admin","Principal","HOD"]),async(req,res)=>{
      const userRole = req.session.userRole
      const name = req.session.Name
      if(userRole=="Admin"){
        const [columns,Request]  =  await backenFunctions.getDSRequestsMainR();
        res.render('Request',{data:Request,columns:columns})
      }else if( userRole=="Principal"){
        const [columns,Request]  =  await backenFunctions.getDSRequestsMainPrincipalR();
        res.render('Request',{data:Request,columns:columns})
      }else if( userRole=="HOD"){
        const [columns,Request]  =  await backenFunctions.getDSRequestsR(name);
        res.render('Request',{data:Request,columns:columns})
      }else{
        const [columns,Request]  =  await backenFunctions.getAllSLRequestsR(name);
        res.render('Request',{data:Request,columns:columns})
      }
      
  })
  
  app.get("/check_recievedreq_product",authorize(["StoreAdmin","Admin"]),async(req,res)=>{
    const userRole = req.session.userRole
    const name = req.session.Name
    if(userRole=="Admin"){
      const [columns,Request]  =  await backenFunctions.getDSRequestsProduct();
      res.render('SL',{data:Request,columns:columns})
    }else{
      const [columns,Request]  =  await backenFunctions.getSLRequestsProduct(name);
      res.render('SL',{data:Request,columns:columns})
    }
    
})



// EXCEL

app.post("/download_excel",async (req,res)=> {
  const data = JSON.parse(req.body.data);
  const columns = JSON.parse(req.body.columns);
    await dataToExcel(data, columns, res) ;
    
})


app.get("/return", (req,res)=>{
    res.redirect("/Homepage")
})


// STOCK

app.get("/main_stock",authorize(["Admin"]),async(req,res)=>{
  res.sendFile(__dirname + "/public/Html/stock.html")
})


app.post("/main_stock" , async(req,res)=>{
  const {product_type,product_name,product_description,quantity,amount,name_of_supplier} = req.body
  await backenFunctions.insertMainStock(product_type,product_name,product_description,quantity,amount,name_of_supplier)
  res.redirect("/Homepage")
  // console.log(req.body);
})

app.get("/getStock",authorize(["StoreAdmin","Admin"]),async(req,res)=>{
  const name = req.session.Name
  const userRole = req.session.userRole
    if(userRole=="Admin"){
    const [columns,Request]  =  await backenFunctions.getMainStock();
    
    res.render('DSStock',{data:Request,columns:columns})
  }else{
    const [columns,Request]  =  await backenFunctions.getDSStock(name);
    
    res.render('DSStock',{data:Request,columns:columns})
  }
})

app.get("/get_all_Stock",authorize(["StoreAdmin","Admin","Staff","Lab Incharge"]),async(req,res)=>{
  const name = req.session.Name
  const userRole = req.session.userRole
    if(userRole=="Admin"){
    const [columns,Request]  =  await backenFunctions.getAllMainStock();
    
    res.render('DSStock',{data:Request,columns:columns})
  }else if(userRole == "StoreAdmin" ){
    const [columns,Request]  =  await backenFunctions.getAllDSStock(name);
    
    res.render('DSStock',{data:Request,columns:columns})
  }else{
    const [columns,Request]  =  await backenFunctions.getAllSLStock(name);
    
    res.render('DSStock',{data:Request,columns:columns})

  }
})

app.get("/dsStock",async(req,res)=>{
  res.sendFile(__dirname + "/public/Html/dsStock.html")
})

app.post("/dsStock" , async(req,res)=>{
  const userRole = req.session.userRole
  const {bill_no,inward_no,deadstock_no} = req.body
  await backenFunctions.insertDSStock(bill_no,inward_no,deadstock_no)
  if(userRole=="Admin"){
    res.redirect("/dsStock")
  }else{
    res.redirect("/Homepage")
  }
  // console.log(req.body);
})

// app.get("/user",async(req,res)=>{
//   // const name = req.session.Name
//   const [Request]  =  await backenFunctions.orders();
//   // res.json(Request)
//   res.render('index',{orders:[Request]});
 
// })


// app.post("/approve", authorize(["HOD", "Principal", "StoreAdmin", "Admin"]), async (req, res) => {
//       const { request_id } = req.body;
//       const userRole = req.session.userRole;

//       if(userRole=="StoreAdmin"){
//         await backenFunctions.insertSupplyingSL(request_id)
//         await backenFunctions.updateSLSupply(request_id)
//     }else if(userRole=="Admin"){
//       await  backenFunctions.insertSupplyingDS(request_id)
//       await backenFunctions.updateDSSupply(request_id)
//     }else if(userRole=="Principal"){
//       await  backenFunctions.updateDSPrincipal(request_id)
//     }else{
//       await backenFunctions.updateDSHOD(request_id)
//     }
//     res.redirect("/check_recieved_req");
// });

app.post("/approve", authorize(["HOD", "Principal", "StoreAdmin", "Admin"]), async (req, res) => {
  const { request_id } = req.body;
  const userRole = req.session.userRole;

  try {
      if (userRole === "StoreAdmin") {
          await backenFunctions.insertSupplyingSL(request_id);
          await backenFunctions.updateSLSupply(request_id);
      } else if (userRole === "Admin") {
          await backenFunctions.insertSupplyingDS(request_id);
          await backenFunctions.updateDSSupply(request_id);
      } else if (userRole === "Principal") {
          await backenFunctions.updateDSPrincipal(request_id);
      } else {
          await backenFunctions.updateDSHOD(request_id);
      }
      console.log('Request approved successfully');
        res.status(200).redirect("/check_recieved_req");
  } catch (error) {
      // Handle the error
      if (error.code === 'ER_SIGNAL_EXCEPTION') {
          console.error(error.errorMessage);
          // Redirect to an error page or send an error response to the client
          res.status(400).send('No stock available for the product');
          return;
      } else {
          // Handle other types of errors
          console.error('Error:', error);
          // Redirect to an error page or send an error response to the client
          res.status(500).send('An unexpected error occurred');
      }
  }
});









app.get('/chart-data',authorize(["StoreAdmin","Admin"]) ,async(req, res) => {
      const name = req.session.Name
      const userRole = req.session.userRole
      let results
      if(userRole == "StoreAdmin"){
        results = await backenFunctions.displayChartDSF(name)
      
      }else{
        results = await backenFunctions.displayChartStockF()
      }
      res.json(results);
  });

// app.get('/display-chart', async(req, res) => {
//   res.sendFile(path.join(__dirname, '/public/HTML/chart.html'));
// });
app.get('/display-chart', async (req, res) => {
  const currentYear = new Date().getFullYear();
  const yearsRange = Array.from({ length: currentYear - 1999 }, (_, index) => currentYear - index);
  res.render('chart', { yearsRange });
});

app.post('/chart-data-c',authorize(["StoreAdmin","Admin","Staff","Lab Incharge"]) ,async(req, res) => {
  const name = req.session.Name
  const userRole = req.session.userRole
  const{startYear,endYear}= req.body
  let results
  if(userRole == "StoreAdmin"){
    results = await backenFunctions.displayChartDSFC(name,startYear,endYear)
  
  }else if(userRole == "Admin"){
    results = await backenFunctions.displayChartStockFC(startYear,endYear)
  }else{
    results = await backenFunctions.displayChartSLFC(name,startYear,endYear)
  }
  res.json(results);
});


app.post('/chart-data-n',authorize(["StoreAdmin","Admin","Staff","Lab Incharge"]) ,async(req, res) => {
  const name = req.session.Name
  const userRole = req.session.userRole
  const{startYear,endYear}= req.body
  let results
  if(userRole == "StoreAdmin"){
    results = await backenFunctions.displayChartDSFN(name,startYear,endYear)
  
  }else if(userRole == "Admin"){
    results = await backenFunctions.displayChartStockFN(startYear,endYear)
  }else{
    results = await backenFunctions.displayChartSLFN(name,startYear,endYear)
  }
  res.json(results);
});






app.post("/recieved",authorize(["Lab Incharge","Staff","StoreAdmin"]),async(req,res)=>{
  const {request_id}= req.body
  const userRole = req.session.userRole
    if(userRole=="StoreAdmin"){
      await backenFunctions.insertSuppliedDS(request_id)
      await backenFunctions.deleteSupplyingDS(request_id)
      await backenFunctions.updateDS(request_id)
  }else{
    await backenFunctions.insertSuppliedSL(request_id)
    await backenFunctions.deleteSupplyingSL(request_id)
    await backenFunctions.updateSL(request_id)
    
  }
  res.redirect("/Homepage")
})

app.post("/reject",authorize(["StoreAdmin","HOD","Principal","Admin"]),async(req,res)=>{
  const {request_id}= req.body
  const userRole = req.session.userRole
  if(userRole=="StoreAdmin"){
      await backenFunctions.rejectSLRequest(request_id)
  }else if(userRole="Admin"){
    await  backenFunctions.rejectDSRequest(request_id)
  }else if(userRole="Principal"){
    await  backenFunctions.rejectDSRequestPrincipal(request_id)
  }else{
    await backenFunctions.rejectDSRequestHOD(request_id)
  }
  res.redirect("/Homepage")
})


app.get("/addLogin",authorize(["Admin"]),async(req,res)=>{
    res.sendFile(__dirname + "/public/HTML/login_Form.html");

})
app.post("/addLogin",authorize(["Admin"]),async(req,res)=>{
  const{email_id,password,role,name}= req.body
  const pass_hash = await bcrypt.hash(password.trim(),13)
  await backenFunctions.insertLogin(email_id,pass_hash,name,role)
  res.redirect("/addLogin")
})



//CSV 



app.post('/upload',authorize(["StoreAdmin","HOD","Principal","Admin"]), upload.single('csvFile'), async (req, res) => {
  const userRole = req.session.userRole
  if (!req.file) {
      return res.status(400).send('No file uploaded.');
  }

  const filename = req.file.filename;
  const originalname = req.file.originalname;
  const destination = req.file.destination;

  try {
      // Rename the uploaded file to the original filename
      await fs.rename(path.join(destination, filename), path.join(destination, originalname));

      // Parse CSV and insert data into MySQL tabl
      if(userRole=="Admin"){
        await backenFunctions.parseAndInsertCSV(path.join(destination, originalname),"Stock");
    }else if(userRole=="StoreAdmin"){
      await backenFunctions.parseAndInsertCSV(path.join(destination, originalname),"suplliedDS");
    }else{
      await backenFunctions.parseAndInsertCSV(path.join(destination, originalname),"suplliedSL");
    }

      res.send(`File ${originalname} uploaded and data inserted into the database successfully.`);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
  }
});



app.post('/getInfo', async(req,res)=>{
   const {name}= req.body;
   const [result] = await backenFunctions.getInfo(name)
   res.json(result)
})










app.get('/dashboard', async (req, res) => {
    const username = req.session.Name;
    const userRole = req.session.Role;
    try {
        // Make a fetch request to an external API with POST method
        const response = await fetch('http://localhost:5501/getInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add any other headers if required
            },
            body: JSON.stringify({ name: username }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json(); // Parse the JSON response

        const navbarHtml = generateNavbar(userRole,data);
        res.send(navbarHtml);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});


function generateNavbar(userRole,data) {
  if(userRole=="StoreAdmin" || userRole =="HOD"){
    return `
    <div class="navbar">
              <div class="profile-info">
                  <!-- Dynamic insertion of fetched data -->
                  <span><img class="main-profile" src="../Images/profile.svg" alt=""></span>
                  <div class="info">
                    <p>Department: <strong>${data.Name}</strong></p>
                    <p>Email:<strong> ${data.email_id}</strong></p>
                    <p>Role: <strong>${data.role}</strong></p>
                    <button id="signOutBtn">Sign Out</button>

                        <!-- Popup container hidden by default -->
                        <div class="popup-container" id="popupContainer" style="display: none;">
                          <div class="popup">
                            <p>Are you sure you want to sign out?</p>
                            <button id="yesBtn">Yes</button>
                            <button id="noBtn">No</button>
                          </div>
                        </div>
                  </div>
              </div>
          </div>`;}
          else{
            return `
            <div class="navbar">
              <div class="profile-info">
                  <!-- Dynamic insertion of fetched data -->
                  <span><img class="main-profile" src="../Images/profile.svg" alt=""></span>
                  <div class="info">
                    <span>Welcome, <strong>${data.Name}</strong></span>
                    <p>Email:<strong> ${data.email_id}</strong></p>
                    <p>Role: <strong>${data.role}</strong></p>
                    <button id="signOutBtn">Sign Out</button>

                        <!-- Popup container hidden by default -->
                        <div class="popup-container" id="popupContainer" style="display: none;">
                          <div class="popup">
                            <p>Are you sure you want to sign out?</p>
                            <button id="yesBtn">Yes</button>
                            <button id="noBtn">No</button>
                          </div>
                        </div>
                  </div>
              </div>
          </div>`;
          }
}



app.get('/signout', (req, res) => {
  // Destroy the session to log the user out
  req.session.destroy((err) => {
      if (err) throw err;
      res.redirect('/');
  });
});
