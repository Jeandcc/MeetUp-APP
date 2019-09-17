const Sequelize = require('sequelize');

// Option 1: Passing parameters separately
const sequelize = new Sequelize('postgres', 'postgres', '0304', {
  host: 'localhost',
  dialect: 'postgres',
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
