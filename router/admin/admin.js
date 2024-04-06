const express = require('express');
const router = express.Router();
const admincontroller = require('../../controller/admin/admincontroller');
const admin = require("../../model/admin/admin");
const passport = require('passport')
router.post("/admin_register",admincontroller.admin_register);
router.post("/admin_login",admincontroller.admin_login);
router.get('/view_admin',passport.authenticate('jwt',{failureRedirect:"/admin/faildlogin"}),admincontroller.view_admin);
router.put('/editadmin/:id',passport.authenticate('jwt',{failureRedirect:"/admin/faildlogin"}),admincontroller.editadmin);
router.delete('/deleteadmin/:id',passport.authenticate('jwt',{failureRedirect:"/admin/faildlogin"}),admincontroller.deleteadmin);
router.post('/multipledelete',passport.authenticate('jwt',{failureRedirect:"/admin/faildlogin"}),admincontroller.multipledelete);



router.get("/faildlogin",(req,res)=>{
    return res.status(400).json({ mes: 'login failed', status: 0 });
})

// routing 
router.use("/manager",require("../manager/manager"))

module.exports = router;