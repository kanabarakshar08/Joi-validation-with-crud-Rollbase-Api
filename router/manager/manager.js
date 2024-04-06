const express = require('express');
const router = express.Router();
const managercontroller = require("../../controller/manager/mangercontroller");
const passport = require("passport");
router.post("/insertmanager",passport.authenticate('jwt',{failureRedirect:"/admin/faildlogin"}),managercontroller.insertmanager);
router.get("/view_manager",passport.authenticate('jwt',{failureRedirect:"/admin/faildlogin"}),managercontroller.view_manager);

router.put('/editmanager/:id',passport.authenticate('jwt',{failureRedirect:"/admin/faildlogin"}),managercontroller.editmanager);
router.delete('/deletemanager/:id',passport.authenticate('jwt',{failureRedirect:"/admin/faildlogin"}),managercontroller.deletemanager);
router.post('/multipledelete',passport.authenticate('jwt',{failureRedirect:"/admin/faildlogin"}),managercontroller.multipledelete);
module.exports = router;