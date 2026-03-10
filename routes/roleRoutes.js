const express = require("express");
const router = express.Router();
const Role = require("../models/Role");
const User = require("../models/User");

// CREATE
router.post("/", async(req,res)=>{
    const role = new Role(req.body);
    await role.save();
    res.json(role);
});

// GET ALL
router.get("/", async(req,res)=>{
    const roles = await Role.find();
    res.json(roles);
});

// GET BY ID
router.get("/:id", async(req,res)=>{
    const role = await Role.findById(req.params.id);
    res.json(role);
});

// UPDATE
router.put("/:id", async(req,res)=>{
    const role = await Role.findByIdAndUpdate(req.params.id, req.body,{new:true});
    res.json(role);
});

// SOFT DELETE
router.delete("/:id", async(req,res)=>{
    const role = await Role.findByIdAndDelete(req.params.id);
    res.json(role);
});

// 4) /roles/id/users
router.get("/:id/users", async(req,res)=>{
    const users = await User.find({role:req.params.id, deleted:false});
    res.json(users);
});

module.exports = router;