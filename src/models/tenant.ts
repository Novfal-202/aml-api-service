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
    tenant_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tenant_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('live', 'draft'),
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
