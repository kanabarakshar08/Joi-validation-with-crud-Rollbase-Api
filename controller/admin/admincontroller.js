const admin = require("../../model/admin/admin");
const manager = require('../../model/manager/manager')
const bcrypt = require('bcrypt');
const jwtDAta = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const Joi = require('joi');

const registerValidationSchema = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    confirm_pass: Joi.string().required(),
    designation: Joi.string().required(),
    salary: Joi.string().required(),
    IsActive: Joi.boolean(),
    Create_Date: Joi.string(),
    Update_Date: Joi.string()
});
module.exports.admin_register = async (req, res) => {
    try {
        const result = registerValidationSchema.validate(req.body);
        if (result.error) {
            return res.status(400).send({ error: result.error.details[0].message });
        }
        let checkEmail = await admin.findOne({ email: req.body.email });
        if (checkEmail) {
            return res.status(400).json({ mes: 'Email is Already Exist', status: 0 });
        }
        else {
            let cpass = req.body.confirm_pass;
            if (cpass == req.body.password) {
                req.body.password = await bcrypt.hash(req.body.password, 10);
                req.body.IsActive = true;
                req.body.Create_Date = new Date().toLocaleString();
                req.body.Update_Date = new Date().toLocaleString();

                let ReData = await admin.create(req.body);
                if (ReData) {
                    return res.status(200).json({ mes: 'Record is Insert', status: 1 });
                }
                else {
                    return res.status(200).json({ mes: 'Record is Not Insert', status: 0 });
                }
            }
            else {
                return res.status(200).json({ mes: 'Confirm password is not match', status: 0 });
            }

        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ mes: 'data admin is Not Found', status: 0 });
    }
}
module.exports.admin_login = async (req, res) => {
    try {
        let checkEmail = await admin.findOne({ email: req.body.email });

        if (checkEmail) {
            // console.log("checkEmail",checkEmail);
            // return
            if (await bcrypt.compare(req.body.password, checkEmail.password)) {

                let token = await jwtDAta.sign({ Admindata: checkEmail }, 'akshar', { expiresIn: '1h' });
                return res.status(200).json({ mes: 'Login is success', status: 1, record: token });
            }
            else {
                return res.status(200).json({ mes: 'password is not match', status: 0 });
            }
        }
        else {
            return res.status(200).json({ mes: 'Invalid Email', status: 0 });
        }
    }
    catch (err) {
        return res.status(400).json({ mes: 'admin data insert time error:-', status: 0 });
    }
}

// view admin by admin token

module.exports.view_admin = async (req, res) => {
    try {
        let search = '';
        if (req.query.search) {
            search = req.query.search
        }
        // console.log(req.query.search);
        if (req.query.page) {
            page = req.query.page;
        }
        else {
            page = 0
        }
        var perpage = 2;

        let admindata = await admin.find({
            $or: [
                { "name": { $regex: ".*" + search + ".*", $options: "i" } },
                { "email": { $regex: ".*" + search + ".*", $options: "i" } },
                { "designation": { $regex: ".*" + search + ".*", $options: "i" } }
            ]
        })
            .limit(perpage)
            .skip(perpage * page);
        if (admindata) {
            return res.status(200).json({ mes: 'view admin by search ', status: 1, ad: admindata });
        }
        let AdminePage = await admin.find({
            $or: [
                { "name": { $regex: ".*" + search + ".*", $options: "i" } },
                { "email": { $regex: ".*" + search + ".*", $options: "i" } },
                { "designation": { $regex: ".*" + search + ".*", $options: "i" } }
            ]
        }).countDocuments();


        if (AdminePage) {
            return res.status(200).json({ mes: 'view admin by pagination data', status: 1, ad: AdminePage });
        }


        let alladminrecord = await admin.find({}).populate('managerId').exec();
        if (alladminrecord) {
        
            return res.status(200).json({ mes: 'view admin data', status: 1, ad: alladminrecord });
        }
        else {
            return res.status(200).json({ mes: 'admin data is not found', status: 0});
        }

    } catch (error) {
        console.log(error);
        return res.status(400).json({ mes: 'admin data view time error', status: 0 });
    }
}
// update admin
module.exports.editadmin = async(req,res)=>{
    try {
        req.body.Update_Date = new Date().toLocaleString();
        let adminupdated = await admin.findByIdAndUpdate(req.params.id, req.body);
        if (adminupdated) {
            let updateprofile = await admin.find({})
            return res.status(200).json({ msg: 'Data Updated Succ....', status: 1, rec: updateprofile });
        }
        else {
            return res.status(400).json({ msg: 'not Updated Succ..', status: 0 });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ mes: 'admin data update time error', status: 0 });   
    }
}

// delete admin 
module.exports.deleteadmin = async(req,res)=>{
    try {
        let deletPostData = await admin.findByIdAndDelete(req.params.id);
        if (deletPostData) {
            return res.status(200).json({ msg: 'Admin Data Delete', status: 1, rec: deletPostData });
        }
        else { 
            return res.status(200).json({ msg: 'Admin Data not Delete', status: 1});
        }
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({ mes: 'admin data delete time error', status: 0 });   
    }
}
// multiple delete 
module.exports.multipledelete = async(req,res)=>{
    try {
        let deleteRec = await admin.deleteMany(req.query);
        return res.status(200).json({ msg: 'Admin Data Delete', status: 1, rec: deleteRec });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ mes: 'admin data multiple delete time error', status: 0 });   
    }
}