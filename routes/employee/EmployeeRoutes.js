const express = require('express');
const router = express.Router();

//Admin
const {
    addEmployee,
    getEmployeeById,
    getEmployee,
    editEmployee,
    deleteEmployee,
    getEmployeeByKey,
    passwordChange
} = require('../controllers/EmployeeController');

router.post('/add', addEmployee);
router.get('/get/:id', getEmployeeById);
router.get('/search/:key', getEmployeeByKey);
router.get('/get', getEmployee);
router.put('/update/:id', editEmployee);
router.delete('/delete/:id', deleteEmployee);
router.put('/password/:id', passwordChange);

module.exports = router;
