const express = require("express");
const alert = require("alert");
const ejs = require("ejs");
const { check, validationResult } = require("express-validator");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://Anish_62072:abc_123456@cluster0.6caodho.mongodb.net/ContactDB");

// const contactSchema = {
//     name: String,
//     email: String,
//     contact: Number
// };
const contactSchema = {
    name: String,
    email: String,
    subject: String,
    message: String
};
const Contact = mongoose.model("Contact", contactSchema);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("Home");
});
app.get("/Contact", (req, res) => {
    res.render("Contact");
});
app.get("/success", (req, res) => {
    res.render("success");
});
app.get("/project", (req, res) => {
    res.render("project");
});
app.get("/resume", (req, res) => {
    res.render("Resume");
})
app.post("/:id", [
    check("InputEmail", "Email is not valid")
        .isEmail()
        .normalizeEmail(),
    check("InputName", "Name is not valid")
        .exists(),
    check("InputMessage", "Message should be at least of 200 character ")
        .exists()
        .isLength({ min: 200 })

], (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        const alert = err.array();
        res.render("Contact", {
            alert
        })
    } else {
        const data = {
            Name: req.body.InputName,
            Email: req.body.InputEmail,
            Subject: req.body.InputSubject,
            Message: req.body.InputMessage
        }
        const newMessage = new Contact({
            name: data.Name,
            email: data.Email,
            subject: data.Subject,
            message: data.Message
        });
        newMessage.save().then(() => {
            res.redirect("/success");
        });
    }
});
let port = process.env.PORT;
if (port == null || port == "") {
    port = 8000;
}
app.listen(port, () => console.log("Listing on port 8000"));