import { DataTypes } from 'sequelize';
import { AppDataSource } from '../config';

export const Tenant = AppDataSource.define(
  'tenant',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    board_id: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('draft', 'live'),
      allowNull: false,
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'tenant',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);
