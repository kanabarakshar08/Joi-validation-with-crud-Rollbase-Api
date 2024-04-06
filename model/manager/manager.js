const mongoose = require('mongoose');
const path = require('path');
const Joi = require('joi');
const RegisterSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salary: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    IsActive: {
        type: Boolean,
        required: true
    },
    Create_Date: {
        type: String,
        required: true
    },
    Update_Date: {
        type: String,
        required: true
    },
    adminId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'admin_Register',
        required: true
    }
});


const managerregister = mongoose.model('manager_Register', RegisterSchema);
module.exports = managerregister;