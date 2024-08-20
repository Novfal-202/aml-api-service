import { DataTypes } from 'sequelize';
import { AppDataSource } from '../config'; // Adjust the import according to your setup

export const TenantBoard = AppDataSource.define(
  'tenant_board',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tenant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('deleted', 'draft', 'approved'),
      allowNull: false,
    },
    class_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    tableName: 'tenant_board',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);
