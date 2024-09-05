import { Tenant } from '../models/tenant';
import { AppDataSource } from '../config';
import { Optional } from 'sequelize';
import { UpdateTenant } from '../types/TenantModel';
import _ from 'lodash';
// import { MasterClass } from '../models/masterClass';

//create service for tenant
export const createTenant = async (req: Optional<any, string> | undefined): Promise<any> => {
  const transact = await AppDataSource.transaction();
  try {
    const insertTenant = await Tenant.create(req, { transaction: transact });
    const { dataValues } = insertTenant;
    await transact.commit();
    return { error: false, dataValues };
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

//get tenant
export const getTenant = async (tenant_id: number): Promise<any> => {
  try {
    const tenant = await Tenant.findOne({
      where: { id: tenant_id, is_active: true },
    });

    return { error: false, tenant };
  } catch (error: any) {
    const errorMessage = error?.message || 'failed to get a record';
    return { error: true, message: errorMessage };
  }
};

//filter tenant with condtion
export const tenantFilter = async (req: Record<string, any>): Promise<any> => {
  const { offset = 0, limit = 10 } = req;

  const whereClause = _.omit(req, ['offset', 'limit']);

  try {
    const getTenant = await Tenant.findAndCountAll({
      where: whereClause,
      offset: Number(offset) || 0,
      limit: Number(limit) || 10,
      raw: true,
    });
    const { rows } = getTenant;

    return {
      error: false,
      rows,
      totalRecords: getTenant.count,
      totalPages: Math.ceil(getTenant.count / limit),
      currentPage: Math.floor(Number(offset) / Number(limit)) + 1,
    };
  } catch (error: any) {
    const errorMessage = error?.message || 'Failed to get a record';
    return { error: true, message: errorMessage };
  }
};

//filter tenants
export const getTenantSearch = async (req: Record<string, any>) => {
  const limit: any = _.get(req, 'limit');
  const offset: any = _.get(req, 'offset');
  const { filters = {} } = req || {};
  try {
    const tenants = await Tenant.findAll({ limit: limit || 100, offset: offset || 0, ...(filters && { where: filters }) });
    return tenants;
  } catch (error: any) {
    const errorMessage = error?.message || 'Failed to get a record';
    return { error: true, message: errorMessage };
  }
};
