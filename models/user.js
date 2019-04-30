const Sequelize = require('sequelize')
const db = require('../config/database')

const User = db.define('user',{
  // attributes
  username: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  is_active: {
    type: Sequelize.STRING,
    allowNull: false
  },
  provider: {
    type: Sequelize.STRING
  },
  avatar: {
    type: Sequelize.STRING
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

module.exports = User