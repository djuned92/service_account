const Sequelize = require('sequelize')
const db = require('../config/database')


const Token = db.define('token',{
  access_token: {
    type: Sequelize.STRING,
    allowNull: false
  },
  refresh_token: {
    type: Sequelize.STRING,
    allowNull: false
  },
  is_used: {
    type: Sequelize.STRING,
    defaultValue: 0
  },
  created_at: {
    type: Sequelize.DATE
  },
  updated_at: {
    type: Sequelize.DATE
  }
}, {
  timestamps: false,
  freezeTableName: true
})

module.exports = Token