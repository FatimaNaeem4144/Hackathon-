
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/LoginSignupForm", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("MongoDB connected");
})
.catch((err) => {
    console.log("Failed to connect", err);
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    projects: [
        {
            title: String,
            developer: String,
            description: String,
            hostedURL: String
        }
    ]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
