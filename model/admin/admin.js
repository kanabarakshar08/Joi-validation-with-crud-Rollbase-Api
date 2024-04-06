const mongoose = require('mongoose');
const path = require('path');
const Joi = require('joi');
const { type } = require('os');




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
    password: {
        type: String,
        required: true
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
    managerId:{
        type:Array,
        ref:'manager_Register',
        required: true
    }
});


const registerData = mongoose.model('admin_Register', RegisterSchema);
module.exports = registerData;