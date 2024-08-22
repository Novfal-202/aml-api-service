import { Tenant } from '../models/tenant';
import { AppDataSource } from '../config';
import { Optional } from 'sequelize';
import { UpdateTenant } from '../types/TenantModel';
import { TenantBoard } from '../models/tenantBoard';

//create service for tenant
export const createTenant = async (req: Optional<any, string> | undefined): Promise<any> => {
  const transact = await AppDataSource.transaction();
  try {
    const insertTenant = await Tenant.create(req, { transaction: transact });
    await transact.commit();
    return { error: false, insertTenant };
  } catch (error: any) {
    await transact.rollback();
    const errorMessage = error?.message || 'failed to create a record';
    return { error: true, message: errorMessage };
  }
};

//get Single tenant by name
export const getTenantByName = async (tenant_name: string): Promise<any> => {
  try {
    const getTenant = await Tenant.findOne({ where: { tenant_name }, raw: true });
    return { error: false, getTenant };
  } catch (error: any) {
    const errorMessage = error?.message || 'failed to get a record';
    return { error: true, message: errorMessage };
  }
};

//update single tenant
export const updatetenant = async (id: number, req: UpdateTenant): Promise<any> => {
  try {
    const transact = await AppDataSource.transaction();
    const whereClause: Record<string, any> = { id };
    whereClause.is_active = true;
    const updateTenant = await Tenant.update(req, { where: whereClause, transaction: transact });
    await transact.commit();
    return { error: false, updateTenant };
  } catch (error: any) {
    const errorMessage = error?.message || 'failed to update a record';
    return { error: true, message: errorMessage };
  }
};

//get Single tenant by id
export const getTenantById = async (id: number): Promise<any> => {
  try {
    const whereClause: Record<string, any> = { id };
    whereClause.is_active = true;
    const getTenant = await Tenant.findOne({ where: whereClause, raw: true });
    return { error: false, getTenant };
  } catch (error: any) {
    const errorMessage = error?.message || 'failed to get a record';
    return { error: true, message: errorMessage };
  }
};

//get tenant along with tennt baord
export const getTenantwithBoard = async (tenant_id: number): Promise<any> => {
  try {
    const getTenant = await Tenant.findAll({
      where: {
        id: tenant_id,
        is_active: true,
      },
      include: [
        {
          model: TenantBoard,
          where: { is_active: true },
          required: false,
        },
      ],
    });
    return { error: false, getTenant };
  } catch (error: any) {
    const errorMessage = error?.message || 'failed to get a record';
    return { error: true, message: errorMessage };
  }
};
