const peripheralsCtrl = {};
const pool = require("../database");
const excel = require("exceljs");
const QRCode = require('qrcode');
const nodemailer = require('nodemailer');

peripheralsCtrl.getHome = async (req, res) => {
    res.status(200).send("ibm-peripherals working!");
  };

peripheralsCtrl.findPtype = async (req, res, next) => {

    pool.open(process.env.DATABASE_STRING, function (err, db) {
        if (err) {
            res.status(403).send(err)
        } else{
            db.query("SELECT id FROM ptype WHERE name = ?;",[req.body.ptype], function(err, data){
                if(err){
                    res.status(400).send(err);
                } else{
                    if(JSON.stringify(data) === '[]'){
                        res.status(401).send("No se puede crear un dipositivo nuevo, tipo de dispositivo invalido");
                  } else{
                        req.ptype = data[0];
                        next();
                  }
                }
            })
            db.close(function (error) { // RETURN CONNECTION TO POOL
                if (error) {
                    res.send("Error mientras se cerraba la conexion");
                }
            });
        }
    })

}

peripheralsCtrl.findBrand = async (req, res, next) => {

    pool.open(process.env.DATABASE_STRING, function (err, db) {
        if (err) {
            res.status(403).send(err)
        } else{
            db.query("SELECT id FROM brand WHERE name = ?;",[req.body.brand], function(err, data){
                if(err){
                    res.status(400).send(err);
                } else{
                    if(JSON.stringify(data) === '[]'){
                        res.status(401).send("No se puede crear un dipositivo nuevo, marca no valida");
                  } else{
                        req.brand = data[0];
                        next();
                  }
                }
            })
            db.close(function (error) { // RETURN CONNECTION TO POOL
                if (error) {
                    res.send("Error mientras se cerraba la conexion");
                }
            });
        }
    })

}

peripheralsCtrl.findPeripheralStatus = async (req, res, next) => {

    pool.open(process.env.DATABASE_STRING, function (err, db) {
        if (err) {
            res.status(403).send(err)
        } else{
            db.query("SELECT id FROM peripheral_status WHERE name = 'Available';", function(err, data){
                if(err){
                    res.status(400).send(err);
                } else{
                    if(JSON.stringify(data) === '[]'){
                        res.status(401).send("No se puede crear un dipositivo nuevo, estatus de periferico no valido");
                  } else{
                        req.peripheral_status = data[0];
                        next();
                  }
                }
            })
            db.close(function (error) { // RETURN CONNECTION TO POOL
                if (error) {
                    res.send("Error mientras se cerraba la conexion");
                }
            });
        }
    })

}    

peripheralsCtrl.createPeripheral = async (req, res) => {
        
    pool.open(process.env.DATABASE_STRING, function (err, db) {
        
        if (err) {
            res.status(403).send(err)
        } else{
            db.query("INSERT INTO peripheral(ptype,description,brand,model,peripheral_status,focal,department) VALUES (?,?,?,?,?,?,(SELECT id from department where name = ?));",[req.ptype.ID,req.body.description,req.brand.ID,req.body.model,req.peripheral_status.ID,req.user.ID,req.user.DEPARTMENT_NAME], function(err, data){
                if(err){
                    res.status(400).send(err);
                } else{
                    res.status(201).send("Registro de dispositivo creado correctamente");
                }
            })
            db.close(function (error) { // RETURN CONNECTION TO POOL
                if (error) {
                    res.send("Error mientras se cerraba la conexion");
                }
            });
        }
    })
}

peripheralsCtrl.getAvailablePeripherals = async (req, res) => {
    
    let focalRole = '';
    
    if(req.user.ROLE_NAME === 'Focal'){
        focalRole = `AND peripheral.department = (SELECT id from department where name = '${req.user.DEPARTMENT_NAME}')`;
    }
    
    pool.open(process.env.DATABASE_STRING, function (err, db) {
        
        if (err) {
            res.status(403).send(err)
        } else{
            db.query(`SELECT peripheral.serial, 
                             ptype.name as ptype, 
                             peripheral.description, 
                             brand.name as brand, 
                             peripheral.model, 
                             peripheral_status.name as peripheral_status,
                             users.first_name || ' ' || users.last_name as user_name,
                             department.name as department_name
            FROM peripheral
            INNER JOIN ptype ON peripheral.ptype = ptype.id
            INNER JOIN brand ON peripheral.brand = brand.id
            INNER JOIN users ON peripheral.focal = users.id
            INNER JOIN peripheral_status ON peripheral.peripheral_status = peripheral_status.id
            INNER JOIN department ON peripheral.department = department.id
            WHERE peripheral_status.name = 'Available' ${focalRole};`, function(err, data){
                if(err){
                    res.status(400).send(err);
                } else{
                    res.status(200).send(data);
                }
            })
            db.close(function (error) { // RETURN CONNECTION TO POOL
                if (error) {
                    res.send("Error mientras se cerraba la conexion");
                }
            });
        }
    })
}

peripheralsCtrl.findEmail = async (req, res, next) => {

    pool.open(process.env.DATABASE_STRING, function (err, db) {
        if (err) {
            res.status(403).send(err)
        } else{
            db.query("SELECT id FROM users WHERE email = ?;",[req.body.employee_email], function(err, data){
                if(err){
                    res.status(400).send(err);
                } else{
                    if(JSON.stringify(data) === '[]'){
                        res.status(401).send("No se puede crear prestamo, email no valido");
                  } else{
                        req.employee_id = data[0];
                        next();
                  }
                }
            })
            db.close(function (error) { // RETURN CONNECTION TO POOL
                if (error) {
                    res.send("Error mientras se cerraba la conexion");
                }
            });
        }
    })

}

peripheralsCtrl.findLoanStatus = async (req, res, next) => {

    pool.open(process.env.DATABASE_STRING, function (err, db) {
        if (err) {
            res.status(403).send(err)
        } else{
            db.query("SELECT id FROM loan_status WHERE name = ?;",["In process"], function(err, data){
                if(err){
                    res.status(400).send(err);
                } else{
                    if(JSON.stringify(data) === '[]'){
                        res.status(401).send("No se puede crear prestamo, estatus de prestamo no valido");
                  } else{
                        req.loan_status = data[0];
                        next();
                  }
                }
            })
            db.close(function (error) { // RETURN CONNECTION TO POOL
                if (error) {
                    res.send("Error mientras se cerraba la conexion");
                }
            });
        }
    })

} 

peripheralsCtrl.checkPeripheralStatus = async (req, res, next) => {
    
    pool.open(process.env.DATABASE_STRING, function (err, db) {
        if (err) {
            res.status(403).send(err)
        } else{
            db.query(`SELECT peripheral.serial
                      FROM peripheral
                      INNER JOIN peripheral_status ON peripheral.peripheral_status = peripheral_status.id
                      WHERE peripheral.serial = ? AND peripheral_status.name = ?;`,[req.body.peripheral_serial,"Available"], function(err, data){
                if(err){
                    res.status(400).send(err);
                } else{
                    if(JSON.stringify(data) === '[]'){
                        res.status(401).send("No se puede crear prestamo, el dispositivo no esta disponible");
                  } else{
                        next();
                  }
                }
            })
            db.close(function (error) { // RETURN CONNECTION TO POOL
                if (error) {
                    res.send("Error mientras se cerraba la conexion");
                }
            });
        }
    })
}

peripheralsCtrl.createLoan = async (req, res, next) => {
    
    pool.open(process.env.DATABASE_STRING, function (err, db) {
        
        if (err) {
            res.status(403).send(err)
        } else{
            db.query("INSERT INTO loan(employee,focal,peripheral_serial,creation,loan_status,condition_accepted,security_auth) VALUES (?,?,?,CURRENT_DATE,?,0,0);",[req.employee_id.ID,req.user.ID,req.body.peripheral_serial,req.loan_status.ID], function(err, data){
                if(err){
                    res.status(400).send(err);
                } else{
                    next();
                }
            })
            db.close(function (error) { // RETURN CONNECTION TO POOL
                if (error) {
                    res.send("Error mientras se cerraba la conexion");
                }
            });
        }
    })

}

peripheralsCtrl.changePeripheralStatus = async (req, res, next) => {
    
    pool.open(process.env.DATABASE_STRING, function (err, db) {
        
        if (err) {
            res.status(403).send(err)
        } else{
            db.query("UPDATE peripheral SET peripheral_status = (SELECT id from peripheral_status WHERE name = 'On loan') where serial = ?;",[req.body.peripheral_serial], function(err, data){
                if(err){
                    res.status(400).send(err);
                } else{
                    next();
                }
            })
            db.close(function (error) { // RETURN CONNECTION TO POOL
                if (error) {
                    res.send("Error mientras se cerraba la conexion");
                }
            });
        }
    })
} 

peripheralsCtrl.sendTermsConditions = async (req, res) => {
    
    pool.open(process.env.DATABASE_STRING, function (err, db) {
        
        if (err) {
            res.status(403).send(err)
        } else{
            db.query(`SELECT loan.id as loan_id, ptype.name as type, brand.name as brand, peripheral.model, peripheral.description
                        FROM loan 
                        INNER JOIN peripheral ON loan.peripheral_serial = peripheral.serial
                        INNER JOIN ptype ON peripheral.ptype = ptype.id
                        INNER JOIN brand ON peripheral.brand = brand.id
                        WHERE loan.peripheral_serial = ${req.body.peripheral_serial} 
                        AND loan.loan_status = (SELECT id from loan_status WHERE name = 'In process')`, function(err, data){
                if(err){
                    res.status(400).send(err);
                } else{
   
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                          user: 'dtest8549@gmail.com',
                          pass: 'izbiqajsfhniawej'
                        }
                      });
                
                      const mailOptions = {
                        from: '"Peripheral Loan Bot" <dtest8549@gmail.com>',
                        to: req.body.employee_email,
                        subject: 'Terms of Service for your New Peripheral Loan',
                        html:   `<p>By clicking the link bellow you are agreeing to be bound by the terms of service at IBM.</p>
                                <ol>
                                    <li>I agree to be responsible for the care of the device that is being assigned to me as a work tool, so I certify that I have the knowledge and ability to use it properly.</li>
                                    <li>In case the device is damaged due to negligence or misuse, since it is a work tool, the case will be reviewed to determine if there was any misuse or neglect of the same, with the understanding that I could be responsible for covering the cost of repair or replacement.</li>
                                    <li>The Device is being assigned to me as a work tool for the performance of the activities of my position, so I will follow these rules regarding the use and care of these instruments provided by IBM and must be returned against the requirement of IBM with the natural wear of use.</li>
                                    <li>In case of loss or theft of the Device for not complying with the security rules established by the company or not delivering it on the established return date, I will be responsible for replacing the amount indicated to me.</li>
                                </ol>
                                <a href="http://159.122.181.210:31748/accept/${data[0].LOAN_ID}"><button cursos="pointer">I accept the terms of service</button></a><br>
                                <p>Peripheral Details:</p>
                                <ul>
                                    <li><b>Type:</b> ${data[0].TYPE}</li>
                                    <li><b>Brand:</b> ${data[0].BRAND}</li>
                                    <li><b>Model:</b> ${data[0].MODEL}</li>
                                    <li><b>Description:</b> ${data[0].DESCRIPTION}</li>
                                </ul>`
                      };
                      
                      transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                          res.status(400).send(err);
                        } else {
                          res.status(201).send('Email sent: ' + info.response);
                        }
                      });
                }
            })
            db.close(function (error) { // RETURN CONNECTION TO POOL
                if (error) {
                    res.send("Error mientras se cerraba la conexion");
                }
            });
        }
    })

} 

peripheralsCtrl.getLoans = async (req, res) => {
    
    let focalRole = '';
    
    if(req.user.ROLE_NAME === 'Focal'){
        focalRole = `AND peripheral.department = (SELECT id from department where name = '${req.user.DEPARTMENT_NAME}')`;
    }
    
    pool.open(process.env.DATABASE_STRING, function (err, db) {
        
        if (err) {
            res.status(403).send(err)
        } else{
            db.query(`SELECT
                        loan.id as loan_id,  
                        users.first_name || ' ' || users.last_name as employee_name,
                        loan.peripheral_serial,
                        ptype.name as type,
                        brand.name as brand,
                        peripheral.model,
                        peripheral.description,
                        loan.creation,
                        loan.concluded,
                        loan.condition_accepted,
                        loan.security_auth,
                        loan_status.name as loan_status
                    FROM loan
                    INNER JOIN users ON loan.employee = users.id
                    INNER JOIN loan_status ON loan.loan_status = loan_status.id
                    INNER JOIN peripheral ON loan.peripheral_serial = peripheral.serial
                    INNER JOIN ptype ON peripheral.ptype = ptype.id
                    INNER JOIN brand ON peripheral.brand = brand.id
                    WHERE loan_status.name != 'Cancelled' ${focalRole}
                    ORDER BY loan_status.id DESC, loan.creation;`, function(err, data){
                if(err){
                    res.status(400).send(err);
                } else{
                    res.status(200).send(data);
                }
            })
            db.close(function (error) { // RETURN CONNECTION TO POOL
                if (error) {
                    res.send("Error mientras se cerraba la conexion");
                }
            });
        }
    })

}

peripheralsCtrl.getPeripheralFields = async (req, res) => {
    
    pool.open(process.env.DATABASE_STRING, function (err, db) {
        
        if (err) {
            res.status(403).send(err)
        } else{
            db.query(`SELECT name FROM ptype;`, function(err, data){
                if(err){
                    res.status(400).send(err);
                } else{
                    req.ptype = data;
                }
            })
            db.query(`SELECT name FROM brand;`, function(err, data){
                if(err){
                    res.status(400).send(err);
                } else{
                    res.status(200).json({ptype: req.ptype, brand: data});
                }
            })
            db.close(function (error) { // RETURN CONNECTION TO POOL
                if (error) {
                    res.send("Error mientras se cerraba la conexion");
                }
            });
        }
    })

}

peripheralsCtrl.getOwnLoans = async (req, res) => {
        
    let role = "employee";
    
    // if(req.user.ROLE_NAME === "Administrator" || req.user.ROLE_NAME === "Focal"){
    //     role = "focal";
    // }

    let query = `SELECT
                    loan.peripheral_serial,
                    ptype.name as type,
                    brand.name as brand,
                    peripheral.model,
                    peripheral.description,
                    loan.creation,
                    loan.concluded,
                    loan.condition_accepted,
                    loan.security_auth
                FROM loan
                INNER JOIN loan_status ON loan.loan_status = loan_status.id
                INNER JOIN peripheral ON loan.peripheral_serial = peripheral.serial
                INNER JOIN ptype ON peripheral.ptype = ptype.id
                INNER JOIN brand ON peripheral.brand = brand.id
                WHERE loan.${role} = ${req.user.ID}`;

    pool.open(process.env.DATABASE_STRING, function (err, db) {
        
        if (err) {
            res.status(403).send(err)
        } else{
            db.query(`${query} AND loan.loan_status = (SELECT id FROM loan_status WHERE name = 'In process') ORDER BY creation;`, function(err, data){
                if(err){
                    res.status(400).send(err);
                } else{
                    req.in_process = data;
                }
            })
            db.query(`${query} AND loan.loan_status = (SELECT id FROM loan_status WHERE name = 'Borrowed') ORDER BY creation;`,[req.user.ID], function(err, data){
                if(err){
                    res.status(400).send(err);
                } else{
                    req.borrowed = data;
                }
            })
            db.query(`${query} AND loan.loan_status = (SELECT id FROM loan_status WHERE name = 'Concluded') ORDER BY creation;`,[req.user.ID], function(err, data){
                if(err){
                    res.status(400).send(err);
                } else{
                    res.status(200).json({in_process: req.in_process, borrowed: req.borrowed, concluded: data});
                }
            })
            db.close(function (error) { // RETURN CONNECTION TO POOL
                if (error) {
                    res.send("Error mientras se cerraba la conexion");
                }
            });
        }
    })

}

peripheralsCtrl.getPeripheralsById = async (req, res) => {

    let query = `SELECT
                    loan.peripheral_serial,
                    ptype.name as type,
                    brand.name as brand,
                    peripheral.model,
                    peripheral.description,
                    loan.creation,
                    loan.concluded,
                    loan.condition_accepted,
                    loan.security_auth
                FROM loan
                INNER JOIN loan_status ON loan.loan_status = loan_status.id
                INNER JOIN peripheral ON loan.peripheral_serial = peripheral.serial
                INNER JOIN ptype ON peripheral.ptype = ptype.id
                INNER JOIN brand ON peripheral.brand = brand.id
                WHERE loan.employee = ${req.body.employee_id}`;

    pool.open(process.env.DATABASE_STRING, function (err, db) {
        
        if (err) {
            res.status(403).send(err)
        } else{
            db.query(`${query} AND loan.loan_status = (SELECT id FROM loan_status WHERE name = 'In process') ORDER BY creation;`, function(err, data){
                if(err){
                    res.status(400).send(err);
                } else{
                    req.in_process = data;
                }
            })
            db.query(`${query} AND loan.loan_status = (SELECT id FROM loan_status WHERE name = 'Borrowed') ORDER BY creation;`,[req.user.ID], function(err, data){
                if(err){
                    res.status(400).send(err);
                } else{
                    req.borrowed = data;
                }
            })
            db.query(`${query} AND loan.loan_status = (SELECT id FROM loan_status WHERE name = 'Concluded') ORDER BY creation;`,[req.user.ID], function(err, data){
                if(err){
                    res.status(400).send(err);
                } else{
                    res.status(200).json({in_process: req.in_process, borrowed: req.borrowed, concluded: data});
                }
            })
            db.close(function (error) { // RETURN CONNECTION TO POOL
                if (error) {
                    res.send("Error mientras se cerraba la conexion");
                }
            });
        }
    })

}

function prepareForInQuery(s) {
    let res = s.toLowerCase();
    res = res.split(',');
    res = res.join("','");
    res = "'"+res+"'";
    return res;
}

peripheralsCtrl.searchLoan = async (req, res) => {

    // if(req.user.ROLE_NAME === 'Administrator'){
    //     req.user.ID = 'true';
    //     WHERE loan.focal = ${req.user.ID}
    // }
    
    let focalRole = 'true';
    if(req.user.ROLE_NAME !== 'Administrator'){
        focalRole = `(SELECT id from department where name = '${req.user.DEPARTMENT_NAME}')`;
    }

    if(!req.query.search){
        req.query.search = "";
    }
    
    let typeQuery = '';
    if(req.query.type){
        typeQuery = `AND LOWER(ptype.name) IN (${prepareForInQuery(req.query.type)})`;
    }

    let brandQuery = '';
    if(req.query.brand){
        brandQuery = `AND LOWER(brand.name) IN (${prepareForInQuery(req.query.brand)})`;
    }

    let statusQuery = '';
    if(req.query.status){
        statusQuery = `AND LOWER(loan_status.name) IN (${prepareForInQuery(req.query.status)})`;
    }
    
    pool.open(process.env.DATABASE_STRING, function (err, db) {
        
        if (err) {
            res.status(403).send(err)
        } else{
            db.query(`SELECT
                        loan.id as loan_id,  
                        users.first_name || ' ' || users.last_name as employee_name,
                        loan.peripheral_serial,
                        ptype.name as type,
                        brand.name as brand,
                        peripheral.model,
                        peripheral.description,
                        loan.creation,
                        loan.concluded,
                        loan.condition_accepted,
                        loan.security_auth,
                        loan_status.name as loan_status
                    FROM loan
                    INNER JOIN users ON loan.employee = users.id
                    INNER JOIN loan_status ON loan.loan_status = loan_status.id
                    INNER JOIN peripheral ON loan.peripheral_serial = peripheral.serial
                    INNER JOIN ptype ON peripheral.ptype = ptype.id
                    INNER JOIN brand ON peripheral.brand = brand.id
                    WHERE peripheral.department = ${focalRole} AND loan_status.name != 'Cancelled'
                    AND
                    (LOWER(users.first_name) LIKE LOWER('%${req.query.search}%')
                    OR LOWER(users.last_name) LIKE LOWER('%${req.query.search}%')
                    OR LOWER(peripheral.model) LIKE LOWER('%${req.query.search}%')
                    OR LOWER(users.first_name || ' ' || users.last_name) LIKE LOWER('%${req.query.search}%'))
                    ${typeQuery} ${brandQuery} ${statusQuery}
                    ORDER BY loan_status.id DESC, loan.creation;`, function(err, data){
                if(err){
                    res.status(400).send(err);
                } else{
                    res.status(200).send(data);
                }
            })
            db.close(function (error) { // RETURN CONNECTION TO POOL
                if (error) {
                    res.send("Error mientras se cerraba la conexion");
                }
            });
        }
    })

}

peripheralsCtrl.searchAvailablePeripheral = async (req, res) => {
    
    let focalRole = '';
    if(req.user.ROLE_NAME !== 'Administrator'){
        focalRole = `AND peripheral.department = (SELECT id from department where name = '${req.user.DEPARTMENT_NAME}')`;
    }
    
    let typeQuery = '';
    if(req.query.type){
        typeQuery = `AND LOWER(ptype.name) IN (${prepareForInQuery(req.query.type)})`;
    }

    let brandQuery = '';
    if(req.query.brand){
        brandQuery = `AND LOWER(brand.name) IN (${prepareForInQuery(req.query.brand)})`;
    }
    
    pool.open(process.env.DATABASE_STRING, function (err, db) {
        
        if (err) {
            res.status(403).send(err)
        } else{
            db.query(`SELECT peripheral.serial, 
                                ptype.name as ptype, 
                                peripheral.description, 
                                brand.name as brand, 
                                peripheral.model, 
                                peripheral_status.name as peripheral_status,
                                users.first_name || ' ' || users.last_name as user_name,
                                department.name as department_name
                    FROM peripheral
                    INNER JOIN ptype ON peripheral.ptype = ptype.id
                    INNER JOIN brand ON peripheral.brand = brand.id
                    INNER JOIN users ON peripheral.focal = users.id
                    INNER JOIN peripheral_status ON peripheral.peripheral_status = peripheral_status.id
                    INNER JOIN department ON peripheral.department = department.id
                    WHERE peripheral_status.name = 'Available'
                    ${focalRole} ${typeQuery} ${brandQuery}
                    ORDER BY peripheral.serial;`, function(err, data){
                if(err){
                    res.status(400).send(err);
                } else{
                    res.status(200).send(data);
                }
            })
            db.close(function (error) { // RETURN CONNECTION TO POOL
                if (error) {
                    res.send("Error mientras se cerraba la conexion");
                }
            });
        }
    })

}

peripheralsCtrl.downloadReport = async (req, res) => {

    let focalRole = 'true';
    if(req.user.ROLE_NAME !== 'Administrator'){
        focalRole = `(SELECT id from department where name = '${req.user.DEPARTMENT_NAME}')`;
    }

    pool.open(process.env.DATABASE_STRING, function (err, db) {
        if (err) {
            res.status(403).send(err)
        } else{
            db.query(`SELECT
                        peripheral.serial as peripheral_serial,  
                        users.first_name as focal_first_name,
                        users.last_name as focal_last_name,
                        users.email as focal_email,
                        ptype.name as type,
                        brand.name as brand,
                        peripheral.model,
                        peripheral.description,
                        department.name as department,
                        peripheral_status.name as peripheral_status
                    FROM peripheral
                    INNER JOIN users ON peripheral.focal = users.id
                    INNER JOIN ptype ON peripheral.ptype = ptype.id
                    INNER JOIN brand ON peripheral.brand = brand.id
                    INNER JOIN peripheral_status ON peripheral.peripheral_status = peripheral_status.id
                    INNER JOIN department ON peripheral.department = department.id
                    WHERE peripheral.department = ${focalRole}
                    ORDER BY peripheral_status.id, peripheral.serial`, function(err, data){
                if(err){
                    res.status(400).send(err);
                } else{
                    req.peripheral = data;
                }
            })
            db.query(`SELECT
                        loan.id as loan_id,  
                        users.first_name as employee_first_name,
                        users.last_name as employee_last_name,
                        users.email as employee_email,
                        loan.peripheral_serial,
                        ptype.name as type,
                        brand.name as brand,
                        peripheral.model,
                        peripheral.description,
                        user_focal.first_name as focal_first_name,
                        user_focal.last_name as focal_last_name,
                        user_focal.email as focal_email,
                        department.name as department,
                        loan.creation,
                        loan.concluded,
                        loan.condition_accepted,
                        loan.security_auth,
                        loan_status.name as loan_status
                    FROM loan
                    INNER JOIN users ON loan.employee = users.id
                    INNER JOIN loan_status ON loan.loan_status = loan_status.id
                    INNER JOIN peripheral ON loan.peripheral_serial = peripheral.serial
                    INNER JOIN ptype ON peripheral.ptype = ptype.id
                    INNER JOIN brand ON peripheral.brand = brand.id
                    INNER JOIN department ON peripheral.department = department.id
                    INNER JOIN users as user_focal ON peripheral.focal = user_focal.id
                    WHERE peripheral.department = ${focalRole} AND loan_status.name != 'Cancelled'
                    ORDER BY loan_status.id DESC, loan.creation`, function(err, data){
                if(err){
                    res.status(400).send(err);
                } else{                                        
                    let workbook = new excel.Workbook();

                    let worksheet = workbook.addWorksheet("Loans", {properties:{defaultColWidth: 15}});
                    worksheet.columns = [
                        { header: "Loan Id", key: "LOAN_ID" },
                        { header: "Employee First Name", key: "EMPLOYEE_FIRST_NAME" },
                        { header: "Employee Last Name", key: "EMPLOYEE_LAST_NAME" },
                        { header: "Employee Email", key: "EMPLOYEE_EMAIL" },
                        { header: "Peripheral Serial", key: "PERIPHERAL_SERIAL" },
                        { header: "Type", key: "TYPE" },
                        { header: "Brand", key: "BRAND" },
                        { header: "Model", key: "MODEL" },
                        { header: "Description", key: "DESCRIPTION" },
                        { header: "Focal First Name", key: "FOCAL_FIRST_NAME" },
                        { header: "Focal Last Name", key: "FOCAL_LAST_NAME" },
                        { header: "Focal Email", key: "FOCAL_EMAIL" },
                        { header: "Department", key: "DEPARTMENT" },
                        { header: "Creation", key: "CREATION" },
                        { header: "Concluded", key: "CONCLUDED" },
                        { header: "Condition Accepted", key: "CONDITION_ACCEPTED" },
                        { header: "Security Auth", key: "SECURITY_AUTH" },
                        { header: "Loan Status", key: "LOAN_STATUS" }
                    ];
                    worksheet.addRows(data);

                    worksheet = workbook.addWorksheet("Peripherals", {properties:{defaultColWidth: 15}});
                    worksheet.columns = [
                        { header: "Peripheral Serial", key: "PERIPHERAL_SERIAL" },
                        { header: "Focal First Name", key: "FOCAL_FIRST_NAME" },
                        { header: "Focal Last Name", key: "FOCAL_LAST_NAME" },
                        { header: "Focal Email", key: "FOCAL_EMAIL" },
                        { header: "Type", key: "TYPE" },
                        { header: "Brand", key: "BRAND" },
                        { header: "Model", key: "MODEL" },
                        { header: "Description", key: "DESCRIPTION" },
                        { header: "Department", key: "DEPARTMENT" },
                        { header: "Peripheral Status", key: "PERIPHERAL_STATUS" }
                    ];
                    worksheet.addRows(req.peripheral);

                    res.setHeader(
                        "Content-Type",
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      );
                      res.setHeader(
                        "Content-Disposition",
                        "attachment; filename=" + "Peripheral Report.xlsx"
                      );
                      return workbook.xlsx.write(res).then(function () {
                        res.status(200).end();
                      });
                }
            })
            db.close(function (error) { // RETURN CONNECTION TO POOL
                if (error) {
                    res.send("Error mientras se cerraba la conexion");
                }
            });
        }
    })

}

peripheralsCtrl.acceptTermsConditions = async (req, res, next) => {

    pool.open(process.env.DATABASE_STRING, function (err, db) {
        if (err) {
            res.status(403).send(err)
        } else{
            db.query(`UPDATE loan SET condition_accepted = 1 WHERE id = ${req.body.loan_id} AND employee = (SELECT id from users where email = '${req.user.EMAIL}');`, function(err, data){
                if(err){
                    res.status(400).send(err);
                }
            })
            db.query(`SELECT peripheral_serial FROM loan WHERE id = ${req.body.loan_id} AND condition_accepted = 1 AND employee = (SELECT id from users where email = '${req.user.EMAIL}');`, function(err, data){
                if(err){
                    res.status(400).send(err);
                } else{
                    if(JSON.stringify(data) === '[]'){
                        res.status(401).send("Este usuario no puede aceptar los terminos y condiciones de este prestamo");
                  } else{
                        next();
                  }
                }
            })
            db.close(function (error) { // RETURN CONNECTION TO POOL
                if (error) {
                    res.send("Error mientras se cerraba la conexion");
                }
            });
        }
    })

}

peripheralsCtrl.generateQRCode = async (req, res, next) => {
        
    try {
    req.qrCode = (await QRCode.toDataURL(`http://159.122.181.210:31748/Security/${req.body.loan_id}`)).slice(22);
    next();
    } catch(err){
          res.status(400).send(err);
    }

}

peripheralsCtrl.sendSecurityQRCode = async (req, res) => {
    
    pool.open(process.env.DATABASE_STRING, function (err, db) {
        
        if (err) {
            res.status(403).send(err)
        } else{
            db.query(`SELECT ptype.name as type, brand.name as brand, peripheral.model, peripheral.description
                        FROM loan 
                        INNER JOIN peripheral ON loan.peripheral_serial = peripheral.serial
                        INNER JOIN ptype ON peripheral.ptype = ptype.id
                        INNER JOIN brand ON peripheral.brand = brand.id
                        WHERE loan.id = ${req.body.loan_id}`, function(err, data){
                if(err){
                    res.status(400).send(err);
                } else{

                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'dtest8549@gmail.com',
                            pass: 'izbiqajsfhniawej'
                        }
                        });
                
                    const mailOptions = {
                        from: '"Peripheral Loan Bot" <dtest8549@gmail.com>',
                        to:  req.user.EMAIL,
                        subject: 'QR Code for your Peripheral Loan',
                        html:   `<p>Show the attached QR Code to the security guard to pick up your peripheral.</p>
                                <p>Peripheral Details:</p>
                                <ul>
                                <li><b>Type:</b> ${data[0].TYPE}</li>
                                <li><b>Brand:</b> ${data[0].BRAND}</li>
                                <li><b>Model:</b> ${data[0].MODEL}</li>
                                <li><b>Description:</b> ${data[0].DESCRIPTION}</li>
                                </ul>`,
                        attachments: 
                        [
                            {
                            filename: 'qrcode.png',
                            content: req.qrCode,
                            encoding: "base64"
                            }
                        ]
                        };
                    
                    transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        res.status(400).send(err);
                    } else {
                        res.status(201).send('Email sent: ' + info.response);
                    }
                    });

                }
            })
            db.close(function (error) { // RETURN CONNECTION TO POOL
                if (error) {
                    res.send("Error mientras se cerraba la conexion");
                }
            });
        }
    })

} 

peripheralsCtrl.confirmSecurityAuth = async (req, res, next) => {

    pool.open(process.env.DATABASE_STRING, function (err, db) {
        if (err) {
            res.status(403).send(err)
        } else{
            db.query(`UPDATE loan SET security_auth = 1 WHERE id = ${req.body.loan_id} AND condition_accepted = 1;`, function(err, data){
                if(err){
                    res.status(400).send(err);
                }
            })
            db.query(`SELECT peripheral_serial FROM loan WHERE id = ${req.body.loan_id} AND condition_accepted = 1 AND security_auth = 1;`, function(err, data){
                if(err){
                    res.status(400).send(err);
                } else{
                    if(JSON.stringify(data) === '[]'){
                        res.status(401).send("No se puede hacer la autenticacion de seguridad en este momento");
                  } else{
                        next();
                  }
                }
            })
            db.close(function (error) { // RETURN CONNECTION TO POOL
                if (error) {
                    res.send("Error mientras se cerraba la conexion");
                }
            });
        }
    })

}

peripheralsCtrl.setToBorrowed = async (req, res) => {

    pool.open(process.env.DATABASE_STRING, function (err, db) {
        if (err) {
            res.status(403).send(err)
        } else{
            db.query(`UPDATE loan SET loan_status = (SELECT id FROM loan_status WHERE name = 'Borrowed') WHERE id = ${req.body.loan_id};`, function(err, data){
                if(err){
                    res.status(400).send(err);
                } else{
                    res.status(201).send("Autenticacion de seguridad hecho, periferico prestado");
                }
            })
            db.close(function (error) { // RETURN CONNECTION TO POOL
                if (error) {
                    res.send("Error mientras se cerraba la conexion");
                }
            });
        }
    })

}

peripheralsCtrl.setToConcluded = async (req, res, next) => {

    pool.open(process.env.DATABASE_STRING, function (err, db) {
        if (err) {
            res.status(403).send(err)
        } else{
            db.query(`UPDATE loan SET loan_status = (SELECT id FROM loan_status WHERE name = 'Concluded'), concluded = CURRENT_DATE WHERE id = ${req.body.loan_id} AND condition_accepted = 1 AND security_auth = 1 AND loan_status = (SELECT id FROM loan_status WHERE name = 'Borrowed');`, function(err, data){
                if(err){
                    res.status(400).send(err);
                }
            })
            db.query(`SELECT peripheral_serial as serial FROM loan WHERE id = ${req.body.loan_id}  AND condition_accepted = 1 AND security_auth = 1 AND loan_status = (SELECT id FROM loan_status WHERE name = 'Concluded');`, function(err, data){
                if(err){
                    res.status(400).send(err);
                } else{
                    if(JSON.stringify(data) === '[]'){
                        res.status(401).send("Este periferico sigue en proceso");
                  } else{
                        req.peripheral_serial = data[0];
                        next();
                  }
                }
            })
            db.close(function (error) { // RETURN CONNECTION TO POOL
                if (error) {
                    res.send("Error mientras se cerraba la conexion");
                }
            });
        }
    })

}

peripheralsCtrl.cancelLoan = async (req, res, next) => {

    pool.open(process.env.DATABASE_STRING, function (err, db) {
        if (err) {
            res.status(403).send(err)
        } else{
            db.query(`UPDATE loan SET loan_status = (SELECT id FROM loan_status WHERE name = 'Cancelled') WHERE id = ${req.body.loan_id} AND loan_status = (SELECT id FROM loan_status WHERE name = 'In process');`, function(err, data){
                if(err){
                    res.status(400).send(err);
                }
            })
            db.query(`SELECT peripheral_serial as serial FROM loan WHERE id = ${req.body.loan_id} AND loan_status = (SELECT id FROM loan_status WHERE name = 'Cancelled');`, function(err, data){
                if(err){
                    res.status(400).send(err);
                } else{
                    if(JSON.stringify(data) === '[]'){
                        res.status(401).send("No se puede cancelar el prestamo de este dispositivo en este momento");
                  } else{
                        req.peripheral_serial = data[0];
                        next();
                  }
                }
            })
            db.close(function (error) { // RETURN CONNECTION TO POOL
                if (error) {
                    res.send("Error mientras se cerraba la conexion");
                }
            });
        }
    })

}

peripheralsCtrl.setToAvailable = async (req, res) => {

    pool.open(process.env.DATABASE_STRING, function (err, db) {
        if (err) {
            res.status(403).send(err)
        } else{
            db.query(`UPDATE peripheral SET peripheral_status = (SELECT id FROM peripheral_status WHERE name = 'Available') WHERE serial = ${req.peripheral_serial.SERIAL};`, function(err, data){
                if(err){
                    res.status(400).send(err);
                } else{
                    res.status(200).send("Estatus de periferico a disponible");
                }
            })
            db.close(function (error) { // RETURN CONNECTION TO POOL
                if (error) {
                    res.send("Error mientras se cerraba la conexion");
                }
            });
        }
    })

}

peripheralsCtrl.getPeripheralByLoanId = async (req, res) => {

    let query = `SELECT
                    loan.peripheral_serial,
                    ptype.name as type,
                    brand.name as brand,
                    peripheral.model,
                    peripheral.description
                FROM loan
                INNER JOIN peripheral ON loan.peripheral_serial = peripheral.serial
                INNER JOIN ptype ON peripheral.ptype = ptype.id
                INNER JOIN brand ON peripheral.brand = brand.id
                WHERE loan.id = ${req.body.loan_id};`;

    pool.open(process.env.DATABASE_STRING, function (err, db) {
        
        if (err) {
            res.status(403).send(err)
        } else{
            db.query(`${query}`, function(err, data){
                if(err){
                    res.status(400).send(err);
                } else{
                    res.status(200).send(data);
                }
            })
            db.close(function (error) { // RETURN CONNECTION TO POOL
                if (error) {
                    res.send("Error mientras se cerraba la conexion");
                }
            });
        }
    })

}

peripheralsCtrl.getLoansInfo = async (req, res) => {

    let focalRole = 'true';
    if(req.user.ROLE_NAME !== 'Administrator'){
        focalRole = `(SELECT id from department where name = '${req.user.DEPARTMENT_NAME}')`;
    }

    query = `SELECT loan.loan_status, COUNT(*) as num_loans
            FROM
                (SELECT loan_status.name as loan_status, department.name as department_name
                FROM loan
                INNER JOIN peripheral ON loan.peripheral_serial = peripheral.serial
                INNER JOIN department ON peripheral.department = department.id
                INNER JOIN loan_status ON loan.loan_status = loan_status.id
                WHERE loan_status.name != 'Cancelled' AND peripheral.department = ${focalRole}) as loan
                GROUP BY loan.loan_status`;

    pool.open(process.env.DATABASE_STRING, function (err, db) {
        
        if (err) {
            res.status(403).send(err)
        } else{
            db.query(`${query}`, function(err, data){
                if(err){
                    res.status(400).send(err);
                } else{
                    res.status(200).send(data);
                }
            })
            db.close(function (error) { // RETURN CONNECTION TO POOL
                if (error) {
                    res.send("Error mientras se cerraba la conexion");
                }
            });
        }
    })

}

peripheralsCtrl.getPeripheralsByType = async (req, res) => {

    let focalRole = 'true';
    if(req.user.ROLE_NAME !== 'Administrator'){
        focalRole = `(SELECT id from department where name = '${req.user.DEPARTMENT_NAME}')`;
    }
    
    let query = `SELECT ptype.name as peripheral_type, COUNT(*) as num_peripherals
                FROM (SELECT * FROM peripheral WHERE peripheral.department = ${focalRole}) as peripheral
                INNER JOIN ptype ON peripheral.ptype = ptype.id
                GROUP BY ptype.name;`;

    pool.open(process.env.DATABASE_STRING, function (err, db) {
        
        if (err) {
            res.status(403).send(err)
        } else{
            db.query(`${query}`, function(err, data){
                if(err){
                    res.status(400).send(err);
                } else{
                    res.status(200).send(data);
                }
            })
            db.close(function (error) { // RETURN CONNECTION TO POOL
                if (error) {
                    res.send("Error mientras se cerraba la conexion");
                }
            });
        }
    })

}

peripheralsCtrl.getPeripheralAvailability = async (req, res) => {

    let focalRole = 'true';
    if(req.user.ROLE_NAME !== 'Administrator'){
        focalRole = `(SELECT id from department where name = '${req.user.DEPARTMENT_NAME}')`;
    }
    
    let query = `SELECT peripheral_status.name as peripheral_status, COUNT(*) as num_peripherals
                FROM (SELECT * FROM peripheral WHERE peripheral.department = ${focalRole}) as peripheral
                INNER JOIN peripheral_status ON peripheral.peripheral_status = peripheral_status.id
                GROUP BY peripheral_status.name;`;

    pool.open(process.env.DATABASE_STRING, function (err, db) {
        
        if (err) {
            res.status(403).send(err)
        } else{
            db.query(`${query}`, function(err, data){
                if(err){
                    res.status(400).send(err);
                } else{
                    res.status(200).send(data);
                }
            })
            db.close(function (error) { // RETURN CONNECTION TO POOL
                if (error) {
                    res.send("Error mientras se cerraba la conexion");
                }
            });
        }
    })

}

peripheralsCtrl.getLoansByDepartment = async (req, res) => {

    let query = `SELECT department.name as department_name, COUNT(*) as num_loans
                FROM (SELECT * FROM loan WHERE loan.loan_status != (SELECT id from loan_status WHERE name = 'Cancelled')) loan
                INNER JOIN peripheral ON loan.peripheral_serial = peripheral.serial
                INNER JOIN department ON peripheral.department = department.id
                GROUP BY department.name;`;

    pool.open(process.env.DATABASE_STRING, function (err, db) {
        
        if (err) {
            res.status(403).send(err)
        } else{
            db.query(`${query}`, function(err, data){
                if(err){
                    res.status(400).send(err);
                } else{
                    res.status(200).send(data);
                }
            })
            db.close(function (error) { // RETURN CONNECTION TO POOL
                if (error) {
                    res.send("Error mientras se cerraba la conexion");
                }
            });
        }
    })

}

peripheralsCtrl.getTotalPeripherals = async (req, res) => {

    let focalRole = '';
    if(req.user.ROLE_NAME !== 'Administrator'){
        focalRole = `WHERE department = (SELECT id from department where name = '${req.user.DEPARTMENT_NAME}')`;
    }
    
    let query = `SELECT count(*) as total FROM peripheral ${focalRole};`;

    pool.open(process.env.DATABASE_STRING, function (err, db) {
        
        if (err) {
            res.status(403).send(err)
        } else{
            db.query(`${query}`, function(err, data){
                if(err){
                    res.status(400).send(err);
                } else{
                    res.status(200).send(data);
                }
            })
            db.close(function (error) { // RETURN CONNECTION TO POOL
                if (error) {
                    res.send("Error mientras se cerraba la conexion");
                }
            });
        }
    })

}

module.exports = peripheralsCtrl;