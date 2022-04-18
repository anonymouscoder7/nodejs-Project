module.exports = (sequelize, Sequelize) => {
  const Logout = sequelize.define("logout", {
    jwtToken: {
      type: Sequelize.STRING,
    },
  });

  return Logout;
};
