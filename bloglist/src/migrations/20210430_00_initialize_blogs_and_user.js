const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable(
      'users',
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
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      }
    )
    await queryInterface.createTable(
      'blogs',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        title: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        author: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        url: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        likes: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        year: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'users', key: 'id' },
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
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      }
    )
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('users', { cascade: true })
    await queryInterface.dropTable('blogs', { cascade: true })
  },
}
