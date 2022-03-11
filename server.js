const express = require("express");
const PORT = process.env.PORT || 3000;
const uuid = require("uuid");
const app = express();
const fs = require("fs");
const logger = require("./middleware/logger");
const members = require("./Members");

// //get api
// try {
//     const jsonString = fs.readFileSync("members.json", "utf8");
//     app.get("/members", (req, res) => {
//         res.send(jsonString);
//     });
// } catch (err) {
//     console.log(err);
// }

//body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//middleware
app.use(logger);

//homepage routing
app.set("view engine", "ejs");
app.get("/", (req, res) => res.render("home"));

app.listen(PORT, () =>
    console.log(`Server is running on port http://localhost:${PORT}`)
);

//get api
app.get("/members", (req, res) => res.json(members));

// get single members
app.get("/members/:id", (req, res) => {
    const found = members.some((member) => member.id === parseInt(req.params.id));
    if (found) {
        res.json(members.filter((member) => member.id === parseInt(req.params.id)));
    } else {
        res.status(400).json({ msg: `No member with the id of ${req.params.id}` });
    }
});

//post member
app.post("/members", (req, res) => {
    const newMember = {
        id: members.length + 1,
        name: req.body.name,
        email: req.body.email,
    };

    if (!newMember.name || !newMember.email) {
        return res.status(400).json({ msg: "Please include a name and email" });
    }
    members.push(newMember);
    res.json(members);
});

//update member
app.put("/members/:id", (req, res) => {
    const found = members.some((member) => member.id === parseInt(req.params.id));
    if (found) {
        const updMmber = req.body;
        members.forEach((member) => {
            if (member.id === parseInt(req.params.id)) {
                member.name = updMmber.name ? updMmber.name : member.name;
                member.email = updMmber.email ? updMmber.email : member.email;
                member.favoriteFood = updMmber.favoriteFood ?
                    updMmber.favoriteFood :
                    member.favoriteFood;
                res.json({ msg: "Member updated", member });
            }
        });
    } else {
        res.status(400).json({ msg: `No member with the id of ${req.params.id}` });
    }
});

//delete member
app.delete("/members/:id", (req, res) => {
    const found = members.some((member) => member.id === parseInt(req.params.id));
    if (found) {
        res.json({
            msg: "Member deleted",
            members: members.filter(
                (member) => member.id !== parseInt(req.params.id)
            ),
        });
    } else {
        res.status(400).json({ msg: `No member with the id of ${req.params.id}` });
    }
});