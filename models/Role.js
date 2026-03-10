const mongoose = require("../config/db");

const RoleSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        default:""
    }
},{
    timestamps:true
});

module.exports = mongoose.model("Role",RoleSchema);