const { Router } = require('express');
const { matchPassword } = require('../controllers/users.controller');
const usersCtrl = require("../controllers/users.controller");
const rolesCtrl = require("../controllers/roles.controller")

const router = Router();
router.get("/", usersCtrl.getHome);
//router.get("/userName", usersCtrl.validateToken, usersCtrl.getUserData);
router.get("/logout", usersCtrl.logout);

router.get("/Admin/getAllUsers", rolesCtrl.validateToken, rolesCtrl.isAdmin, usersCtrl.getAllUsers)

router.get("/isLogged", rolesCtrl.validateToken, usersCtrl.getUserData)

router.get("/AdminFocal/searchUsers/name=:name", rolesCtrl.validateToken, rolesCtrl.isFocalORAdmin, usersCtrl.searchUsers);

router.get("/AdminFocal/getUser/id=:id", rolesCtrl.validateToken, rolesCtrl.isFocalORAdmin, usersCtrl.getUser)

router.get("/Admin/searchUsers/", rolesCtrl.validateToken, rolesCtrl.isAdmin,usersCtrl.findRole,usersCtrl.findUsersAdmin);

router.get("/Admin/updateRole/", rolesCtrl.validateToken, rolesCtrl.isAdmin, usersCtrl.findRole, usersCtrl.updateRole);
router.post("/login", usersCtrl.matchEmail,usersCtrl.matchPassword);
router.post("/register", usersCtrl.register);
module.exports = router; 