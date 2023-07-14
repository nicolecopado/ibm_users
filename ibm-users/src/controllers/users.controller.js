const usersCtrl = {};
const pool = require("../database")
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

usersCtrl.getHome = async (req, res) => {
  res.status(200).send("ibm-users working!");
};

usersCtrl.matchEmail = async (req, res, next) => {
    //await bcryptjs.compare(req.body.password, "123456");
    //res.send(process.env.DATABASE_STRING);
    var userFound;
    try{
        pool.open(process.env.DATABASE_STRING, function (err, db) {
            if (err) {
                res.status(403).send(err);
            } else{
                
                db.query("SELECT * FROM users WHERE email = ?", [req.body.email],function(err, data) {
                    if(err){
                      res.send(err);
                    } else{
                      if(data.length == 0 /*|| await checkPassword(req.body.password, data[0].PASSWORD)/*!(await bcryptjs.compare(req.body.password, data[0].PASSWORD))*/){
                            res.status(401).send("Credenciales incorrectas");
                      } else{
                            req.user = data[0]
                            next()
                      }
                    }
                })
                db.close(function (error) { // RETURN CONNECTION TO POOL
                    if (error) {
                        res.status(403).send("Error mientras se cerraba la conexion")
                    }
                });
            }
            
        })
    } catch (err){
        console.log(err)
    }
        
}

usersCtrl.matchPassword = async (req, res, next) => {
    if(await bcryptjs.compare(req.body.password,req.user.PASSWORD)){
        const id = req.user.ID;
        const token = jwt.sign({id:id}, process.env.JWT_SECRETKEY)
        const cookieOptions = {
            expires: new Date(Date.now()+90*24*60*1000),
            // httpOnly: true,
            // sameSite: 'none',
            // secure: true,
            // domain: "http://169.51.205.229:31622"
        }
        res.cookie('jwt', token, cookieOptions);
        res.status(200).send("Inicio de sesion correcto")
    } else{ 
        res.status(401).send("Credenciales incorrectas")
    }
}

usersCtrl.getUserData = async(req, res) => {
    if(req.user){
        res.status(200).send(req.user);
    } else{
        res.status(401).send("Inicio de sesion requerido");
    }
}

usersCtrl.logout = async(req, res) => {
    res.clearCookie('jwt');
    res.status(200).send("Sesion cerrada correctamente");
}

usersCtrl.register = async(req,res) => {
    const email = req.body.email;
    const password = await bcryptjs.hash(req.body.password, 10);
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const department = req.body.department;
    const role = req.body.role;


    pool.open(process.env.DATABASE_STRING, function (err, db) {
        if (err) {
            res.status(400).send(err)
        } else{
            
            db.query("INSERT INTO users(email,password,first_name,last_name,department,role) VALUES (?, ?, ?, ?, ?, ?);",[email,password,firstName,lastName, department, role], function(err, data){
                if(err){
                    res.status(400).send(err)
                } else{
                    res.status(200).send("Usuario creado correctamente")
                }
            })
            db.close(function (error) { // RETURN CONNECTION TO POOL
                if (error) {
                    res.send("Error mientras se cerraba la conexion")
                }
            });
        }})

}

usersCtrl.getAllUsers = async (req, res) => {
    pool.open(process.env.DATABASE_STRING, function (err, db) {
        if (err) {
            res.status(400).send(err)
        } else{
            db.query(`SELECT users.id, users.first_name, users.last_name, users.email,
            role.name as role_name, department.name as department_name 
            FROM users 
            INNER JOIN role ON users.role=role.id 
            INNER JOIN department ON users.department=department.id `, function(err, data){
                if(err){
                    res.status(400).send(err)
                } else{
                    res.status(200).send(data)
                }
            })
            db.close(function (error) { // RETURN CONNECTION TO POOL
                if (error) {
                    res.send("Error mientras se cerraba la conexion")
                }
            });
        }})
}


usersCtrl.searchUsers = async (req,res) => {
    
    pool.open(process.env.DATABASE_STRING, function (err, db) {
        if (err) {
            res.status(401).send(err);
        } else{
            console.log(typeof req.params.name)
            db.query(`SELECT users.id, users.first_name, users.last_name, users.email,
                role.name as role_name, department.name as department_name  
                FROM users 
                INNER JOIN role ON users.role=role.id 
                INNER JOIN department ON users.department=department.id 
                WHERE LOWER(users.first_name) LIKE LOWER(?)
                OR LOWER(users.last_name) LIKE LOWER(?)
                OR LOWER(users.email) LIKE LOWER(?);`,['%'+req.params.name+'%', '%'+req.params.name+'%', '%'+req.params.name+'%'], function(err, data){
                        
                if(err){
                    res.status(401).send(err);
                } else{
                    if(data.length>0){
                        res.status(200).send(data);
                    } else{
                        res.status(401).send("Users not found");
                    }
                }
            })
            db.close(function (error) { // RETURN CONNECTION TO POOL
                if (error) {
                    res.send("Error mientras se cerraba la conexion")
                }
            });
        }})
}

usersCtrl.getUser = async (req,res) => {
    pool.open(process.env.DATABASE_STRING, function (err, db) {
        if (err) {
            res.status(401).send(err);
        } else{
            
            db.query(`SELECT users.id, users.first_name, users.last_name, users.email,
                    role.name as role_name, department.name as department_name  
                    FROM users 
                    INNER JOIN role ON users.role=role.id 
                    INNER JOIN department ON users.department=department.id 
                    WHERE users.id = ?;`,[req.params.id], function(err, data){
                if(err){
                    res.status(401).send(err);
                } else{
                    if(data.length>0){
                        res.status(200).send(data[0]);
                    } else{
                        res.status(401).send("User not found");
                    }
                }
            })
            db.close(function (error) { // RETURN CONNECTION TO POOL
                if (error) {
                    res.send("Error mientras se cerraba la conexion")
                }
            });
        }})
}

usersCtrl.findUsersAdmin = async(req,res) => {
    
    if(!req.query.user){
        req.query.user = ""
    }
    if(!req.query.rolesID){
        req.query.rolesID="true"
    }
    let query = `SELECT users.id, users.first_name, users.last_name, users.email,
    role.name as role_name, department.name as department_name  
    FROM users 
    INNER JOIN role ON users.role=role.id 
    INNER JOIN department ON users.department=department.id
    WHERE (LOWER(users.first_name) LIKE LOWER('%${req.query.user}%')
    OR LOWER(users.last_name) LIKE LOWER('%${req.query.user}%')
    OR LOWER(users.email) LIKE LOWER('%${req.query.user}%'))
    AND users.role IN (${req.query.rolesID});`
    
    pool.open(process.env.DATABASE_STRING, function (err, db) {
        if (err) {
            res.status(401).send(err);
        } else{
            
            db.query(query, function(err, data){
                if(err){
                    res.status(500).send(err);
                } else{
                    if(data.length>0){
                        res.status(200).send(data);
                    } else{
                        res.status(401).send("User not found");
                    }
                }
            })
            db.close(function (error) { // RETURN CONNECTION TO POOL
                if (error) {
                    res.send("Error mientras se cerraba la conexion")
                }
            });
        }})
}

usersCtrl.findRole = async (req,res,next)=>{
    
    if(req.query.role){
        let roles = req.query.role.split(',');
        roles = roles.join("','");
        roles="'"+roles+"'"
        pool.open(process.env.DATABASE_STRING, function (err, db) {
            if (err) {
                res.status(401).send(err);
            } else{
                db.query(`SELECT role.id
                        FROM role
                        WHERE role.name IN (${roles});`, function(err, data){
                    if(err){
                        res.status(401).send(err);
                    } else{
                        if(data.length>0){
                            let ids=[]
                            data.forEach(element => {
                                ids.push(element.ID)
                            });
                            ids = ids.join(",");
                            req.query.rolesID = ids;
                            next();
                        } else{
                            res.status(401).send("Role not found");
                        }
                    }
                })
                db.close(function (error) { // RETURN CONNECTION TO POOL
                    if (error) {
                        res.send("Error mientras se cerraba la conexion")
                    }
                });
            }})
    } else {
        next();
    }
}

usersCtrl.updateRole = async(req, res) => {
    if(!req.query.rolesID){
        res.status(400).send("Role nedeed");
    } else{
        console.log(req.query.rolesID);
        pool.open(process.env.DATABASE_STRING, function (err, db) {
            if (err) {
                res.status(401).send(err);
            } else{
                
                db.query(`UPDATE Users
                    SET Role = ? 
                    WHERE id = ?`, [req.query.rolesID,req.query.id],function(err, data){
                    if(err){
                        res.status(500).send(err);
                    } else{
                        res.status(200).send(data);
                    }
                })
                db.close(function (error) { // RETURN CONNECTION TO POOL
                    if (error) {
                        res.send("Error mientras se cerraba la conexion")
                    }
                });
            }})
    }
}
module.exports = usersCtrl;