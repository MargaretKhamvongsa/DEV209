require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json()); // Enable JSON parsing
app.use(cors()); // Enable CORS for frontend calls

// ✅ Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/todo-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// ✅ Define User and Todo Models
const UserSchema = new mongoose.Schema({ username: String, password: String });
const TodoSchema = new mongoose.Schema({ title: String, description: String, userId: String });

const User = mongoose.model("User", UserSchema);
const Todo = mongoose.model("Todo", TodoSchema);

// ✅ Test Route
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

// ✅ Register User
app.post("/users/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword });

        res.json({ message: "User registered!" });
    } catch (error) {
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
});

// ✅ Login User
app.post("/users/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, "SECRET_KEY", { expiresIn: "1h" });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Login failed", error: error.message });
    }
});

// ✅ Get Todos (Requires Authentication)
app.get("/todos", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.verify(token, "SECRET_KEY");
        const todos = await Todo.find({ userId: decoded.userId });

        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch todos", error: error.message });
    }
});

// ✅ Create Todo
app.post("/todos", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const decoded = jwt.verify(token, "SECRET_KEY");
        await Todo.create({ title: req.body.title, description: req.body.description, userId: decoded.userId });

        res.json({ message: "Todo added!" });
    } catch (error) {
        res.status(500).json({ message: "Failed to create todo", error: error.message });
    }
});

// ✅ Delete Todo
app.delete("/todos/:id", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) return res.status(401).json({ message: "Unauthorized" });

        await Todo.findByIdAndDelete(req.params.id);
        res.json({ message: "Todo deleted!" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete todo", error: error.message });
    }
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});