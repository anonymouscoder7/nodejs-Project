const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const path = require("path");

const app = express();

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(cors(corsOptions));

var corsOptions = {
    origin: "http://localhost:3000",
};

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* app.use(express.static("uploads")); */

const db = require("./model/index");
const Op = db.Sequelize.Op;
const Role = db.Roles;
const Auth = db.Auths;

// db.sequelize.sync({ force: true }); ----= in development

db.sequelize
    .sync()
    .then(() => {
        initial();
    })
    .catch((err) => {
        console.log(err);
    });

function initial() {
    /* roles Seeder */
    Role.findOrCreate({
        where: { id: 1 },
        defaults: {
            id: 1,
            name: "user",
        },
    })
        .then((result) => {
            console.log("User Created");
        })
        .catch((err) => {
            console.log(err);
        });

    Role.findOrCreate({
        where: { id: 2 },
        defaults: {
            id: 2,
            name: "admin",
        },
    })
        .then((result) => {
            console.log("Admin Created");
        })
        .catch((err) => {
            console.log(err);
        });

    Role.findOrCreate({
        where: { id: 3 },
        defaults: {
            id: 3,
            name: "sealer",
        },
    })
        .then((result) => {
            console.log("Sealer created");
        })
        .catch((err) => {
            console.log(err);
        });

    /* end Role Seeder */

    /* start admin seeder */

    const project = Auth.findOne({ where: { email: "admin@gmail.com" } })
        .then((result) => {
            if (!result) {
                Auth.create({
                    username: "admin",
                    email: "admin@gmail.com",
                    password: bcrypt.hashSync("password", 8),
                })
                    .then((user) => {
                        Role.findAll({
                            where: {
                                name: "admin",
                            },
                        }).then((roles) => {
                            user
                                .setRoles(roles)
                                .then(() => {
                                    // end save sealer
                                    console.log('success')
                                })
                                .catch((err) => {
                                    console.log('error')
                                });
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                console.log("Admin Already Seeded");
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

//Auth
const authRoute = require("./routes/auth/auth")

// @Auth
app.use("/api", authRoute)

// set port, listen for requests
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
