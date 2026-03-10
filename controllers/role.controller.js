const Role = require("../models/Role");

exports.createRole = async (req, res) => {
  try {
    const role = await Role.create({
      name: req.body.name,
      description: req.body.description ?? "",
    });
    return res.status(201).json(role);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find({ deletedAt: null }).sort({ createdAt: -1 });
    return res.json(roles);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findOne({ _id: req.params.id, deletedAt: null });
    if (!role) return res.status(404).json({ message: "Role not found" });
    return res.json(role);
  } catch (err) {
    return res.status(400).json({ message: "Invalid id" });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const role = await Role.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      { $set: { name: req.body.name, description: req.body.description } },
      { new: true, runValidators: true }
    );
    if (!role) return res.status(404).json({ message: "Role not found" });
    return res.json(role);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.softDeleteRole = async (req, res) => {
  try {
    const role = await Role.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      { $set: { deletedAt: new Date() } },
      { new: true }
    );
    if (!role) return res.status(404).json({ message: "Role not found" });
    return res.json({ message: "Role soft-deleted", role });
  } catch (err) {
    return res.status(400).json({ message: "Invalid id" });
  }
};