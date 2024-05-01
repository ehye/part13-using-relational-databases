const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class ReadingList extends Model {}

ReadingList.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    blog_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'blogs', key: 'id' },
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: 'reading_lists',
  }
)

ReadingList.beforeCreate((m) => {
  m.created_at = new Date()
})
ReadingList.beforeBulkCreate((m) => {
  m.created_at = new Date()
})

module.exports = ReadingList
