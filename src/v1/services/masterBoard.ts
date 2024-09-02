import { MasterBoard } from '../models/masterBoard';
import { AppDataSource } from '../config';
import { Optional } from 'sequelize';
import { UpdateTenantBoard } from '../types/TenantBoard';
import _ from 'lodash';

//create service for tenant
export const createTenantBoard = async (req: Optional<any, string> | undefined): Promise<any> => {
  const transact = await AppDataSource.transaction();
  try {
    const transact = await AppDataSource.transaction();
    const insertTenantBoard = await MasterBoard.create(req, { transaction: transact });
    await transact.commit();
    return { error: false, insertTenantBoard };
  } catch (error: any) {
    await transact.rollback();
    const errorMessage = error?.message || 'failed to create a record';
    return { error: true, message: errorMessage };
  }
};

//get Single tenant by name
export const getTenantBoardByName = async (tenant_name: string): Promise<any> => {
  try {
    const getTenantBoard = await MasterBoard.findOne({ where: { tenant_name }, raw: true });
    return { error: false, getTenantBoard };
  } catch (error: any) {
    const errorMessage = error?.message || 'failed to get a record';
    return { error: true, message: errorMessage };
  }
};

//bulk create tenant board
export const bulkCreateTenantBoard = async (req: any): Promise<any> => {
  const transact = await AppDataSource.transaction();
  try {
    const transact = await AppDataSource.transaction();
    const bulkInsertTenantBoard = await MasterBoard.bulkCreate(req, { transaction: transact });
    await transact.commit();
    return { error: false, bulkInsertTenantBoard };
  } catch (error: any) {
    await transact.rollback();
    const errorMessage = error?.message || 'failed to create a record';
    return { error: true, message: errorMessage };
  }
};

//update single tenant
export const updatetenantBoard = async (tenant_id: number, req: UpdateTenantBoard, id: number): Promise<any> => {
  const transact = await AppDataSource.transaction();
  try {
    const whereClause: Record<string, any> = { tenant_id, is_active: true };

    if (id !== undefined) {
      whereClause.id = id;
    }
    const updateTenant = await MasterBoard.update(req, { where: whereClause, transaction: transact });
    await transact.commit();
    return { error: false, updateTenant };
  } catch (error: any) {
    await transact.rollback();
    const errorMessage = error?.message || 'failed to update a record';
    return { error: true, message: errorMessage };
  }
};

//get Single tenant by id
export const getTenantBoardById = async (tenant_id: number, id: number): Promise<any> => {
  try {
    const whereClause: Record<string, any> = { tenant_id, is_active: true };

    if (id !== undefined) {
      whereClause.id = id;
    }

    const getTenant = await MasterBoard.findAll({ where: whereClause, raw: true });
    return { error: false, getTenant };
  } catch (error: any) {
    const errorMessage = error?.message || 'failed to get a record';
    return { error: true, message: errorMessage };
  }
};

//filter tenant with condtion
export const tenantBoardFilter = async (req: Record<string, any>): Promise<any> => {
  const { offset = 0, limit = 10 } = req;

  const whereClause = _.omit(req, ['offset', 'limit']);

  try {
    const getTenantBoard = await MasterBoard.findAndCountAll({
      where: whereClause,
      offset: Number(offset) || 0,
      limit: Number(limit) || 10,
      raw: true,
    });
    const { rows } = getTenantBoard;
    return {
      error: false,
      rows,
      totalRecords: getTenantBoard.count,
      totalPages: Math.ceil(getTenantBoard.count / limit),
      currentPage: Math.floor(Number(offset) / Number(limit)) + 1,
    };
  } catch (error: any) {
    const errorMessage = error?.message || 'Failed to get a record';
    return { error: true, message: errorMessage };
  }
};
