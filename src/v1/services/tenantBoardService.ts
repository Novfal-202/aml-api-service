import { TenantBoard } from '../models/tenantBoard';
import { AppDataSource } from '../config';
import { Optional } from 'sequelize';
import { UpdateTenantBoard } from '../types/TenantBaord';

//create service for tenant
export const createTenantBoard = async (req: Optional<any, string> | undefined) => {
  const transact = await AppDataSource.transaction();
  const insertTenantBoard = await TenantBoard.create(req, { transaction: transact });
  await transact.commit();
  return insertTenantBoard;
};

//get Single tenant by name
export const getTenantBoardByName = async (tenant_name: string) => {
  return TenantBoard.findOne({ where: { tenant_name }, raw: true });
};

//bulk create tenant board
export const bulkCreateTenantBoard = async (req: any) => {
  const transact = await AppDataSource.transaction();
  const insertTenantBoard = await TenantBoard.bulkCreate(req, { transaction: transact });
  await transact.commit();
  return insertTenantBoard;
};

//update single tenant
export const updatetenantBoard = async (req: UpdateTenantBoard, id: number, tenant_id: number) => {
  const transact = await AppDataSource.transaction();
  const updateTenant = await TenantBoard.update(req, { where: { id, tenant_id }, transaction: transact });
  await transact.commit();
  return updateTenant;
};

//get Single tenant by id
export const getTenantBoardById = async (id: number) => {
  return TenantBoard.findOne({ where: { id }, raw: true });
};
