const User = require('../models/User');
const { generateToken } = require('../utils/jwtUtils');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({ name, email, password: hashedPassword });

        // Generate token
        const token = generateToken(user);

        res.status(201).json({
            message: "User registered successfully",
            data: {
                id: user.userId,  // Auto-incremented ID
                name: user.name,
                email: user.email,
                role: user.role,
                token: token
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find user and select password for verification
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Compare passwords securely
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate token
        const token = generateToken(user);

        res.json({
            message: "Successfully logged in",
            data: {
                id: user.userId,
                name: user.name,
                email: user.email,
                role: user.role,
                token: token
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { register, login };