const { Router } = require('express');
const peripheralsCtrl = require("../controllers/peripherals.controller");
const rolesCtrl = require("../controllers/roles.controller");

const router = Router();

router.get("/", peripheralsCtrl.getHome);

/*
Body:
{
    "ptype": "Keyboard",
    "description": "Compact mechanical keyboard",
    "brand": "Steren",
    "model": "str0291383"
}
*/
router.post("/AdminFocal/createPeripheral", rolesCtrl.validateToken, 
                                            rolesCtrl.isFocalORAdmin, 
                                            peripheralsCtrl.findPtype,
                                            peripheralsCtrl.findBrand,
                                            peripheralsCtrl.findPeripheralStatus,
                                            peripheralsCtrl.createPeripheral);

/*
Returns only the available peripherals
Res:
[
    {
        "SERIAL": 51,
        "PTYPE": "Keyboard",
        "DESCRIPTION": "Compact mechanical keyboard",
        "BRAND": "Steren",
        "MODEL": "str0291383",
        "PERIPHERAL_STATUS": "Available",
        "USER_NAME": "Samuel Diaz",
        "DEPARTMENT_NAME": "Validation"
    },
    {...}
]
*/
router.get("/AdminFocal/getAvailablePeripherals", rolesCtrl.validateToken,
                                                  rolesCtrl.isFocalORAdmin,
                                                  peripheralsCtrl.getAvailablePeripherals);

/*
After creating a loan, it sends an email to the employee to accept the terms and conditions
Body:
{
    "employee_email": "miguel@gmail.com",
    "peripheral_serial": "26"
}
*/
router.post("/AdminFocal/createLoan", rolesCtrl.validateToken,
                                      rolesCtrl.isFocalORAdmin,
                                      peripheralsCtrl.findEmail,
                                      peripheralsCtrl.findLoanStatus,
                                      peripheralsCtrl.checkPeripheralStatus,
                                      peripheralsCtrl.createLoan,
                                      peripheralsCtrl.changePeripheralStatus,
                                      peripheralsCtrl.sendTermsConditions);

router.get("/AdminFocal/getLoans", rolesCtrl.validateToken,
                                   rolesCtrl.isFocalORAdmin,
                                   peripheralsCtrl.getLoans);

/*
Res:
{
    "ptype": [{"Name":"Mouse"}, {"NAME": "Keyboard"}, ...],
    "brand": [{"Name":"HP"}, {"NAME": "Steren"}, ...]
}
*/
router.get("/AdminFocal/getPeripheralFields", rolesCtrl.validateToken,
                                              rolesCtrl.isFocalORAdmin,
                                              peripheralsCtrl.getPeripheralFields);

/*
Res:
{
    "in_process": [],
    "borrowed": [],
    "concluded": []
}
*/                                            
router.get("/getOwnLoans", rolesCtrl.validateToken,
                           rolesCtrl.notSecurity,
                           peripheralsCtrl.getOwnLoans);

/*
Returns a list of peripheral information of a chosen employee
Body:
{
    "employee_id": 23
}
Res:
{
    "in_process": [],
    "borrowed": [],
    "concluded": []
}
*/ 
router.post("/AdminFocal/getPeripheralsById", rolesCtrl.validateToken,
                                              rolesCtrl.isFocalORAdmin,
                                              peripheralsCtrl.getPeripheralsById);

/*
URL example:
localhost:4001/AdminFocal/searchLoan/?search=sa&type=Headset%2CKeyboard&brand=Steren&status=In%20Process

URL variables
search: find coincidences in string on first_name, last_name, *full_name and peripheral_model (Ex: search=sa)
* full names can be searched with spaces in url (Ex: search=saul%20dom)

type: only return peripherals of the specified type, can be many (Ex: type=Keyboard%2CMouse)

brand: only return peripherals of the specified brand, can be many (Ex: brand=Samsung%2CLogitech)

status: only return loans of the specified status, can be many (Ex: status=In%20Process%2CBorrowed)
*/
router.get("/AdminFocal/searchLoan/", rolesCtrl.validateToken,
                                      rolesCtrl.isFocalORAdmin,
                                      peripheralsCtrl.searchLoan);

/*
Filter only available peripherals

URL example:
localhost:4001/AdminFocal/searchAvailablePeripheral/?type=Keyboard&brand=Samsung%2CSteren

URL variables
type: only return peripherals of the specified type, can be many (Ex: type=Keyboard%2CMouse)

brand: only return peripherals of the specified brand, can be many (Ex: brand=Samsung%2CLogitech)
*/
router.get("/AdminFocal/searchAvailablePeripheral/", rolesCtrl.validateToken,
                                                     rolesCtrl.isFocalORAdmin,
                                                     peripheralsCtrl.searchAvailablePeripheral);

router.get("/AdminFocal/downloadReport", rolesCtrl.validateToken,
                                         rolesCtrl.isFocalORAdmin,
                                         peripheralsCtrl.downloadReport);

/*
Change terms and conditions value to true of a specific loan
Only the employee can accept the terms and conditions
After accepting terms and conditions, it send an email with qrcode to the employee for the security auth
Body:
{
    "loan_id": 5
}
*/
router.post("/acceptTermsConditions", rolesCtrl.validateToken,
                                      rolesCtrl.notSecurity,
                                      peripheralsCtrl.acceptTermsConditions,
                                      peripheralsCtrl.generateQRCode,
                                      peripheralsCtrl.sendSecurityQRCode);

/*
Change security authentication value to true of a specific loan
It will also change the status of the loan to "Borrowed"
It can only be perform by a security guard
Terms and conditions must be accepted beforehand this can be used
Body:
{
    "loan_id": 5
}
*/
router.post("/Security/confirmSecurityAuth", rolesCtrl.validateToken,
                                             rolesCtrl.isSecurity,
                                             peripheralsCtrl.confirmSecurityAuth,
                                             peripheralsCtrl.setToBorrowed);

/*
Set loan status to "Concluded" by the admin or focal once the device is returned
The status of the loan should be "Borrowed" before it can conclude
It changes the status of the peripheral to "Available"
Body:
{
    "loan_id": 5
}
*/
router.post("/AdminFocal/setToConcluded", rolesCtrl.validateToken,
                                          rolesCtrl.isFocalORAdmin,
                                          peripheralsCtrl.setToConcluded,
                                          peripheralsCtrl.setToAvailable);

/*
Cancel a loan by changing it status to "Cancelled"
Normally loans with this status are hiden from front-end users
It can only be canceled while it is still "In process"
It changes the status of the peripheral to "Available"
Body:
{
    "loan_id": 5
}
*/
router.post("/AdminFocal/cancelLoan", rolesCtrl.validateToken,
                                      rolesCtrl.isFocalORAdmin,
                                      peripheralsCtrl.cancelLoan,
                                      peripheralsCtrl.setToAvailable);

/*
It returns the essential information of a specific peripheral asigned to a loan
All loged-in users can access this function
Body:
{
    "loan_id": 5
}
*/
router.post("/getPeripheralByLoanId", rolesCtrl.validateToken,
                                      peripheralsCtrl.getPeripheralByLoanId);

/*
Information for the top part of the dashboard
Res:
[
    {
        "LOAN_STATUS": "Borrowed",
        "NUM_LOANS": 1
    },
    {
        "LOAN_STATUS": "Concluded",
        "NUM_LOANS": 3
    },
    {
        "LOAN_STATUS": "In process",
        "NUM_LOANS": 4
    }
]
*/
router.get("/AdminFocal/getLoansInfo", rolesCtrl.validateToken,
                                       rolesCtrl.isFocalORAdmin,
                                       peripheralsCtrl.getLoansInfo);

/*
Amount of peripherals per type
Res:
[
    {
        "PERIPHERAL_TYPE": "Headset",
        "NUM_PERIPHERALS": 3
    },
    {
        "PERIPHERAL_TYPE": "Keyboard",
        "NUM_PERIPHERALS": 8
    },
    {...}
]
*/
router.get("/AdminFocal/getPeripheralsByType", rolesCtrl.validateToken,
                                               rolesCtrl.isFocalORAdmin,
                                               peripheralsCtrl.getPeripheralsByType);

/*
Amount of peripheral availability
Res:
[
    {
        "PERIPHERAL_STATUS": "Available",
        "NUM_PERIPHERALS": 10
    },
    {
        "PERIPHERAL_STATUS": "On loan",
        "NUM_PERIPHERALS": 7
    }
]
*/
router.get("/AdminFocal/getPeripheralAvailability", rolesCtrl.validateToken,
                                                    rolesCtrl.isFocalORAdmin,
                                                    peripheralsCtrl.getPeripheralAvailability);

/*
The total amount per area includes active loans "In process", "Borrowed" and "Concluded"
This one is global and does not change between focal or admin
Res:
[
    {
        "DEPARTMENT_NAME": "Cloud",
        "NUM_LOANS": 2
    },
    {
        "DEPARTMENT_NAME": "Labs",
        "NUM_LOANS": 3
    },
    {...}
]
*/
router.get("/AdminFocal/getLoansByDepartment", rolesCtrl.validateToken,
                                               rolesCtrl.isFocalORAdmin,
                                               peripheralsCtrl.getLoansByDepartment);

/*
Res the total amount of PERIPHERALS (in the department in the case of focal users)
*/
router.get("/AdminFocal/getTotalPeripherals", rolesCtrl.validateToken,
                                              rolesCtrl.isFocalORAdmin,
                                              peripheralsCtrl.getTotalPeripherals);

module.exports = router;