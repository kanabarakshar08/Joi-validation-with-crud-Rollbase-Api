const admin = require("../../model/admin/admin");
const manager = require("../../model/manager/manager")
const path = require('path');
const fs = require('fs');
const Joi = require('joi');

const registerValidationSchema = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    designation: Joi.string().required(),
    salary: Joi.string().required(),
    IsActive: Joi.boolean(),
    Create_Date: Joi.string(),
    Update_Date: Joi.string(),

});
module.exports.insertmanager = async (req, res) => {
    try {
        const result = registerValidationSchema.validate(req.body);
        if (result.error) {
            return res.status(400).send({ error: result.error.details[0].message });
        }
        let checkEmail = await manager.findOne({ email: req.body.email });
        if (checkEmail) {
            return res.status(400).json({ mes: 'Email is Already Exist', status: 0 });
        }
        else {
                req.body.adminId = req.user.id
                req.body.IsActive = true;
                req.body.Create_Date = new Date().toLocaleString();
                req.body.Update_Date = new Date().toLocaleString();

                let managerdata = await manager.create(req.body);
                if (managerdata) {
                    let reg  = await admin.findById(req.user.id);
                    reg.managerId.push(managerdata.id);
                    await admin.findByIdAndUpdate(req.user.id,reg);
                    return res.status(200).json({ mes: 'Record is Insert', status: 1,md:managerdata });
                }
                else {
                    return res.status(200).json({ mes: 'Record is Not Insert', status: 0 });
                }
            

        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ mes: 'manger dataa is Not Found', status: 0 });
    }
}

module.exports.view_manager = async (req, res) => {
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

        let mangersearchdata = await manager.find({
            $or: [
                { "name": { $regex: ".*" + search + ".*", $options: "i" } },
                { "email": { $regex: ".*" + search + ".*", $options: "i" } },
                { "designation": { $regex: ".*" + search + ".*", $options: "i" } }
            ]
        })
            .limit(perpage)
            .skip(perpage * page);
        if (mangersearchdata) {
            return res.status(200).json({ mes: 'view manger by search ', status: 1, mgserch: mangersearchdata });
        }
        let mangerpage = await manager.find({
            $or: [
                { "name": { $regex: ".*" + search + ".*", $options: "i" } },
                { "email": { $regex: ".*" + search + ".*", $options: "i" } },
                { "designation": { $regex: ".*" + search + ".*", $options: "i" } }
            ]
        }).countDocuments();


        if (mangerpage) {
            return res.status(200).json({ mes: 'view manger by pagination data', status: 1, mgpage: AdminePage });
        }


        let allmanagerdata = await manager.find({}).populate('adminId').exec();
        if (allmanagerdata) {
            
            return res.status(200).json({ mes: 'view manger data', status: 1, mdr: allmanagerdata });
        }
        else {
            return res.status(200).json({ mes: 'manger data is not found', status: 0});
        }

    } catch (error) {
        console.log(error);
        return res.status(400).json({ mes: 'manager data view time error', status: 0 });
    }
}
// edit manager 
module.exports.editmanager= async(req,res)=>{
    try {
        req.body.Update_Date = new Date().toLocaleString();
        let managerupdated = await manager.findByIdAndUpdate(req.params.id, req.body);
        if (managerupdated) {
           
            return res.status(200).json({ msg: 'Data Updated Succ....', status: 1, rec: managerupdated });
        }
        else {
            return res.status(400).json({ msg: 'not Updated Succ..', status: 0 });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ mes: 'Manager data update time error', status: 0 });   
    }
}

// delete manager 
module.exports.deletemanager = async(req,res)=>{
    try {
        let deletPostData = await manager.findByIdAndDelete(req.params.id);
        if (deletPostData) {
            return res.status(200).json({ msg: 'Manager Data Delete', status: 1, rec: deletPostData });
        }
        else { 
            return res.status(200).json({ msg: 'Manager Data not Delete', status: 1});
        }
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({ mes: 'Manager data delete time error', status: 0 });   
    }
}
// multiple delete 
module.exports.multipledelete = async(req,res)=>{
    try {
        let deleteRec = await manager.deleteMany(req.query);
        return res.status(200).json({ msg: 'Manager Data Delete', status: 1, rec: deleteRec });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ mes: 'Manager data multiple delete time error', status: 0 });   
    }
}