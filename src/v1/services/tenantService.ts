import { Tenant } from '../models/tenant';
import { AppDataSource } from '../config';
import { Optional } from 'sequelize';
import { UpdateTenant } from '../types/TenantModel';

//create service for tenant
export const createTenant = async (req: Optional<any, string> | undefined) => {
  const transact = await AppDataSource.transaction();
  try {
    const insertTenant = await Tenant.create(req, { transaction: transact });
    await transact.commit();
    return { error: false, insertTenant };
  } catch (error: any) {
    await transact.rollback();
    return { error: true, message: error.message };
  }
};

//get Single tenant by name
export const getTenantByName = async (tenant_name: string) => {
  try {
    const getTenant = await Tenant.findOne({ where: { tenant_name }, raw: true });
    return { error: false, getTenant };
  } catch (error: any) {
    return { error: true, message: error.message };
  }
};

//update single tenant
export const updatetenant = async (req: UpdateTenant, id: number) => {
  try {
    const transact = await AppDataSource.transaction();
    const updateTenant = await Tenant.update(req, { where: { id }, transaction: transact });
    await transact.commit();
    return { error: false, updateTenant };
  } catch (error: any) {
    return { error: true, message: error.message };
  }
};

//get Single tenant by id
export const getTenantById = async (id: number) => {
  try {
    const getTenant = await Tenant.findOne({ where: { id }, raw: true });
    return { error: false, getTenant };
  } catch (error: any) {
    return { error: true, message: error.message };
  }
};
