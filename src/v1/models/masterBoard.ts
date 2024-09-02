import { DataTypes } from 'sequelize';
import { AppDataSource } from '../config';

export const MasterBoard = AppDataSource.define(
  'master_board',
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
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('deleted', 'draft', 'approved'),
      allowNull: false,
    },
    class_id: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: 'master_board',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);
