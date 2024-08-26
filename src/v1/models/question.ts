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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tenant_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tenant_board_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    class_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    repository_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    l1_skill: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    l2_skill: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    l3_skill: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sub_skills: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    answer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prerequisites: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    benchmark_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hints: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    solutions: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    gradient: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rubrics: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    version: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    media: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    i18n: {
      type: DataTypes.JSONB,
      allowNull: false,
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
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.INTEGER,
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
