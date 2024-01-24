const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const mongoose = require("mongoose");

const templatePath = path.join(__dirname, '../templates');
const User = require("./mongodb");

app.use(express.json());
app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.get("/project", async (req, res) => {
    try {
        // Fetch the user by some identifier (e.g., name or user ID)
        const userName = req.session.userName; // Assuming you are using sessions
        const user = await User.findOne({ name: userName });

        if (!user) {
            return res.render("project", { errorMessage: "User not found" });
        }

        // Dummy projects data
        const dummyProjects = [
            {
                title: "Sample Project 1",
                developer: "John Doe",
                description: "This is a dummy project description.",
                hostedURL: "http://sample-project-1.com"
            },
            {
                title: "Sample Project 2",
                developer: "Jane Smith",
                description: "Another dummy project description.",
                hostedURL: "http://sample-project-2.com"
            }
        ];

        // You can merge the dummy projects with the user's real projects
        const projects = user.projects.concat(dummyProjects);

        res.render("project", { projects });
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.render("project", { errorMessage: "Error fetching projects" });
    }
});



app.post("/signup", async (req, res) => {
    const { name, password, confirmpassword } = req.body;

    if (password !== confirmpassword) {
        return res.send("Password and Confirm Password do not match");
    }

    const userData = {
        name: name,
        password: password,
        confirmpassword: confirmpassword,
        projects: []  // Initialize projects array for new users
    };

    await User.insertMany([userData]);
    res.render("home");
});

app.post("/login", async (req, res) => {
    try {
        const check = await User.findOne({ name: req.body.name });

        if (check.password === req.body.password) {
            req.session.userName = req.body.name;  // Store user name in session
            res.render("home");
        } else {
            res.send("Wrong Password");
        }
    } catch {
        res.send("Wrong Details");
    }
});

app.listen(7001, () => {
    console.log("Server is running on port 7001");
});
