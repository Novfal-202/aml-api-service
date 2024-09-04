import { DataTypes } from 'sequelize';
import { AppDataSource } from '../config';

export const Question = AppDataSource.define(
  'question',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    identifier: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    quid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('grid', 'mcq', 'fib'),
      allowNull: false,
    },
    operation: {
      type: DataTypes.ENUM('add', 'sub', 'multiply', 'division'),
      allowNull: true,
    },
    name: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    description: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    tenant: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    repository: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    qlevel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    taxonomy: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    gradient: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hints: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    solutions: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('live', 'deleted', 'progress'),
      allowNull: false,
    },
    media: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    body: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    version: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true,
    },
  },
  {
    tableName: 'question',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);
