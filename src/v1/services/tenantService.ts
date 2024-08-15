import { Tenant } from '../models/tenant';
import { AppDataSource } from '../config';
import { Optional } from 'sequelize';
import { UpdateTenant } from '../types/TenantModel';

//create service for tenant
export const createTenant = async (req: Optional<any, string> | undefined) => {
  const transact = await AppDataSource.transaction();
  const insertTenant = await Tenant.create(req, { transaction: transact });
  await transact.commit();
  return insertTenant;
};

//get Single tenant
export const getTenant = async (tenant_name: string) => {
  return Tenant.findOne({ where: { tenant_name }, raw: true });
};

//update single tenant
export const updatetenant = async (req: UpdateTenant, id: { id: number }) => {
  const transact = await AppDataSource.transaction();
  const updateTenant = await Tenant.update(req, { where: id, transaction: transact });
  await transact.commit();
  return updateTenant;
};
