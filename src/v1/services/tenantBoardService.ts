import { TenantBoard } from '../models/tenantBoard';
import { AppDataSource } from '../config';
import { Optional } from 'sequelize';
import { UpdateTenantBoard } from '../types/TenantBaord';

//create service for tenant
export const createTenantBoard = async (req: Optional<any, string> | undefined) => {
  const transact = await AppDataSource.transaction();
  try {
    const transact = await AppDataSource.transaction();
    const insertTenantBoard = await TenantBoard.create(req, { transaction: transact });
    await transact.commit();
    return { error: false, insertTenantBoard };
  } catch (error: any) {
    await transact.rollback();
    return { error: true, message: error.message };
  }
};

//get Single tenant by name
export const getTenantBoardByName = async (tenant_name: string) => {
  try {
    const getTenantBoard = await TenantBoard.findOne({ where: { tenant_name }, raw: true });
    return { error: false, getTenantBoard };
  } catch (error: any) {
    return { error: true, message: error.message };
  }
};

//bulk create tenant board
export const bulkCreateTenantBoard = async (req: any) => {
  const transact = await AppDataSource.transaction();
  try {
    const transact = await AppDataSource.transaction();
    const bulkInsertTenantBoard = await TenantBoard.bulkCreate(req, { transaction: transact });
    await transact.commit();
    return { error: false, bulkInsertTenantBoard };
  } catch (error: any) {
    await transact.rollback();
    return { error: true, message: error.message };
  }
};

//update single tenant
export const updatetenantBoard = async (req: UpdateTenantBoard, id: number, tenant_id: number) => {
  const transact = await AppDataSource.transaction();
  try {
    const updateTenant = await TenantBoard.update(req, { where: { id, tenant_id }, transaction: transact });
    await transact.commit();
    return { error: false, updateTenant };
  } catch (error: any) {
    await transact.rollback();
    return { error: true, message: error.message };
  }
};

//get Single tenant by id
export const getTenantBoardById = async (id: number) => {
  try {
    const getTenant = await TenantBoard.findOne({ where: { id }, raw: true });
    return { error: false, getTenant };
  } catch (error: any) {
    return { error: true, message: error.message };
  }
};
