import { Tenant } from '../models/tenant';
import { AppDataSource } from '../config';
import { Optional } from 'sequelize';

export const createTenant = async (req: Optional<any, string> | undefined) => {
  const transact = await AppDataSource.transaction();
  const insertTenant = await Tenant.create(req, { transaction: transact });
  await transact.commit();
  return insertTenant;
};

export const getTenant = async (tenant_name: string) => {
  return Tenant.findOne({ where: { tenant_name }, raw: true });
};
