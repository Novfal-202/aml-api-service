import { TenantBoard } from '../models/tenantBoard';
import { AppDataSource } from '../config';
import { Optional } from 'sequelize';
import { UpdateTenantBoard } from '../types/TenantBoard';

//create service for tenant
export const createTenantBoard = async (req: Optional<any, string> | undefined): Promise<any> => {
  const transact = await AppDataSource.transaction();
  try {
    const transact = await AppDataSource.transaction();
    const insertTenantBoard = await TenantBoard.create(req, { transaction: transact });
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
    const getTenantBoard = await TenantBoard.findOne({ where: { tenant_name }, raw: true });
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
    const bulkInsertTenantBoard = await TenantBoard.bulkCreate(req, { transaction: transact });
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
    const updateTenant = await TenantBoard.update(req, { where: whereClause, transaction: transact });
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

    const getTenant = await TenantBoard.findAll({ where: whereClause, raw: true });
    return { error: false, getTenant };
  } catch (error: any) {
    const errorMessage = error?.message || 'failed to get a record';
    return { error: true, message: errorMessage };
  }
};
