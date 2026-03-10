const express = require("express");
const router = express.Router();
const User = require("../models/User");


// CREATE
router.post("/", async(req,res)=>{
    const user = new User(req.body);
    await user.save();
    res.json(user);
});


// GET ALL (query username includes)
router.get("/", async(req,res)=>{

    const keyword = req.query.username || "";

    const users = await User.find({
        deleted:false,
        username:{$regex:keyword,$options:"i"}
    }).populate("role");

    res.json(users);
});


// GET BY ID
router.get("/:id", async(req,res)=>{
    const user = await User.findById(req.params.id).populate("role");
    res.json(user);
});


// UPDATE
router.put("/:id", async(req,res)=>{
    const user = await User.findByIdAndUpdate(req.params.id, req.body,{new:true});
    res.json(user);
});


// SOFT DELETE
router.delete("/:id", async(req,res)=>{
    const user = await User.findByIdAndUpdate(req.params.id,
        {deleted:true},
        {new:true}
    );

    res.json({message:"Soft deleted"});
});


// 2) enable
router.post("/enable", async(req,res)=>{

    const {email,username} = req.body;

    const user = await User.findOne({email,username});

    if(!user)
        return res.json({message:"User not found"});

    user.status = true;
    await user.save();

    res.json(user);
});


// 3) disable
router.post("/disable", async(req,res)=>{

    const {email,username} = req.body;

    const user = await User.findOne({email,username});

    if(!user)
        return res.json({message:"User not found"});

    user.status = false;
    await user.save();

    res.json(user);
});

module.exports = router;