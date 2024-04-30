const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Validation isEmail on username failed',
        },
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: 'user',
  }
)

module.exports = User
