const { Router } = require('express');
const rolesCtrl = require("../controllers/roles.controller");

const router = Router();
//router.get("/changeRole");
router.get("/checkAdmin", rolesCtrl.validateToken, rolesCtrl.isAdmin);
router.get("/checkFocal", rolesCtrl.validateToken, rolesCtrl.isFocal);
router.get("/checkEmployee", rolesCtrl.validateToken, rolesCtrl.isEmployee);

module.exports = router;