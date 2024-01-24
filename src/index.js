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
        // Assuming you are using sessions and the user's name is stored in the session
        const userName = req.session.userName;

        // Find the user by the stored user name
        const user = await User.findOne({ name: userName });

        if (!user) {
            return res.render("project", { errorMessage: "User not found" });
        }

        // Fetch all projects from the user's document
        const projects = user.projects;

        res.render("project", { projects });
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.render("project", { errorMessage: "Error fetching projects" });
    }
});

app.post("/project", async (req, res) => {
    try {
        const { name, title, developer, description, hostedURL } = req.body;

        // Find the user by the submitted name
        const user = await User.findOne({ name });

        if (!user) {
            return res.render("project", { errorMessage: "User not found" });
        }

        // Create a new project based on the submitted data
        const newProject = {
            title,
            developer,
            description,
            hostedURL
        };

        // Push the new project to the user's projects array
        user.projects.push(newProject);

        // Save the updated user document
        await user.save();

        // Fetch all projects from the user's document
        const projects = user.projects;

        // Render the project.hbs page with the list of projects
        res.render("project", { projects, successMessage: "Project submitted successfully!" });
    } catch (error) {
        console.error("Error submitting project:", error);
        res.render("project", { errorMessage: "Error submitting project" });
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
    };

    await User.insertMany([userData]);
    res.render("home");
});

// Handle user login
app.post("/login", async (req, res) => {
    try {
        const check = await User.findOne({ name: req.body.name });

        if (check.password === req.body.password) {
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
