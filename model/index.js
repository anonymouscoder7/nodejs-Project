const dbConfig = require("../config/db.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    logging: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
    },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Auth Models
db.Auths = require("./auth/auth")(sequelize, Sequelize);
db.Logouts = require("./auth/logout")(sequelize, Sequelize);
db.Roles = require("./auth/role")(sequelize, Sequelize);


//Auth Table Join
/* start role */

db.Roles.belongsToMany(db.Auths, {
    through: "auth_roles",
    foreignKey: "roleId",
    otherKey: "authId",
});
db.Auths.belongsToMany(db.Roles, {
    through: "auth_roles",
    foreignKey: "authId",
    otherKey: "roleId",
});

db.ROLES = ["user", "admin", "sealer"];
/* end role */

module.exports = db;