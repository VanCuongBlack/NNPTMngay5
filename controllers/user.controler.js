const User = require("../models/User");

/**
 * 1) CREATE
 */
exports.createUser = async (req, res) => {
  try {
    const user = await User.create({
      username: req.body.username,
      password: req.body.password, // nên hash
      email: req.body.email,
      fullName: req.body.fullName ?? "",
      avatarUrl: req.body.avatarUrl, // nếu undefined sẽ dùng default
      status: req.body.status ?? false,
      role: req.body.role,
      loginCount: req.body.loginCount ?? 0,
    });

    return res.status(201).json(user);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

/**
 * 2) READ ALL (query username includes)
 * GET /users?username=an
 */
exports.getAllUsers = async (req, res) => {
  try {
    const { username } = req.query;

    const filter = { deletedAt: null };
    if (username && username.trim()) {
      // includes: dùng regex, không phân biệt hoa thường
      filter.username = { $regex: username.trim(), $options: "i" };
    }

    const users = await User.find(filter)
      .populate({ path: "role", match: { deletedAt: null } })
      .sort({ createdAt: -1 });

    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * 3) READ BY ID
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, deletedAt: null })
      .populate({ path: "role", match: { deletedAt: null } });

    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (err) {
    return res.status(400).json({ message: "Invalid id" });
  }
};

/**
 * 4) UPDATE
 */
exports.updateUser = async (req, res) => {
  try {
    const patch = { ...req.body };
    delete patch.deletedAt; // không cho update soft delete bằng đường này

    const user = await User.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      { $set: patch },
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

/**
 * 5) SOFT DELETE
 */
exports.softDeleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      { $set: { deletedAt: new Date() } },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ message: "User soft-deleted", user });
  } catch (err) {
    return res.status(400).json({ message: "Invalid id" });
  }
};

/**
 * 2) POST /enable: truyền email + username đúng thì status = true
 */
exports.enableUser = async (req, res) => {
  try {
    const { email, username } = req.body;
    if (!email || !username) {
      return res.status(400).json({ message: "email and username are required" });
    }
const user = await User.findOneAndUpdate(
      { email, username, deletedAt: null },
      { $set: { status: true } },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found or mismatch info" });
    return res.json({ message: "Enabled", user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * 3) POST /disable: truyền email + username đúng thì status = false
 */
exports.disableUser = async (req, res) => {
  try {
    const { email, username } = req.body;
    if (!email || !username) {
      return res.status(400).json({ message: "email and username are required" });
    }

    const user = await User.findOneAndUpdate(
      { email, username, deletedAt: null },
      { $set: { status: false } },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found or mismatch info" });
    return res.json({ message: "Disabled", user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * 4) GET /roles/:id/users => tất cả user có role = :id
 */
exports.getUsersByRoleId = async (req, res) => {
  try {
    const roleId = req.params.id;

    const users = await User.find({ role: roleId, deletedAt: null })
      .populate("role")
      .sort({ createdAt: -1 });

    return res.json(users);
  } catch (err) {
    return res.status(400).json({ message: "Invalid role id" });
  }
};
