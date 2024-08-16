import { Request, Response } from 'express';
import * as _ from 'lodash';
import * as uuid from 'uuid';
import httpStatus from 'http-status';
import { getTenantById, updatetenant } from '../../services/tenantService';
import { schemaValidation } from '../../services/validationService';
import logger from '../../utils/logger';
import { errorResponse, successResponse } from '../../utils/response';
import tenantUpdateJson from './updateTenatValidationSchema.json';
import { getTenantBoardById, updatetenantBoard } from '../../services/tenantBoardService';

export const apiId = 'api.tenant.udpate';

type UpdateFunction = (data: any, id: number, tenant_id: number) => Promise<any>;

type getFunction = (id: any) => Promise<any>;

//update action for tenant and tenant board
const updateActions: Record<string, UpdateFunction> = {
  tenant: async (data, id) => await updatetenant(data, id),
  tenantBoard: async (data, id, tenant_id) => await updatetenantBoard(data, id, tenant_id),
};

//get action for tenant and tenant board
const getActions: Record<string, getFunction> = {
  tenant: async (id) => await getTenantById(id),
  tenantBoard: async (id) => await getTenantBoardById(id),
};

export const tenantUpdate = async (req: Request, res: Response) => {
  const requestBody = req.body;
  const id = uuid.v4();
  const key = _.get(req, 'params.key');

  try {
    _.merge(requestBody, { params: key });
    //validating the update schema
    const isRequestValid: Record<string, any> = schemaValidation(requestBody, tenantUpdateJson);
    if (!isRequestValid.isValid) {
      const code = 'TENANT_INVALID_INPUT';
      logger.error({ code, apiId, requestBody, message: isRequestValid.message });
      return res.status(httpStatus.BAD_REQUEST).json(errorResponse(id, httpStatus.BAD_REQUEST, isRequestValid.message, code));
    }

    //validating the tenant is already exist
    const isTenantExists = await checkTenantExists(_.get(requestBody, ['id']), key);
    if (!isTenantExists) {
      const code = 'TENANT_NOT_EXISTS';
      logger.error({ code, apiId, requestBody, message: `${key} not exists with id:${_.get(requestBody, ['id'])}` });
      return res.status(httpStatus.CONFLICT).json(errorResponse(id, httpStatus.CONFLICT, `${key} not exists with id:${_.get(requestBody, ['id'])}`, code));
    }

    //update existing tenant or tenant board
    const updateFunction: UpdateFunction = updateActions[key];
    const keysToOmit = _.has(requestBody, 'tenant_id') ? ['id', 'tenant_id', 'params'] : ['id', 'paramsc'];
    const updateData = _.omit(requestBody, keysToOmit);
    const updateId = requestBody.id;
    const updateTenantId = requestBody.tenant_id || '';
    const updateTenant = await updateFunction(updateData, updateId, updateTenantId);
    if (!updateTenant.error) {
      logger.info({ apiId, requestBody, message: `${key} update Successfully for id:${updateId} and tenant_id:${updateTenantId}` });
      return res.status(httpStatus.OK).json(successResponse(id, { data: { message: `${key} update Successfully for id:${updateId} and tenant_id:${updateTenantId}` } }));
    }
    throw new Error(updateTenant.message);
  } catch (error: any) {
    const code = _.get(error, 'code') || 'TENANT_CREATION_FAILURE';
    let errorMessage = error;
    const statusCode = _.get(error, 'statusCode', 500);
    if (!statusCode || statusCode == 500) {
      errorMessage = { code, message: error.message };
    }
    logger.error({ error, apiId, code, requestBody });
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(errorResponse(id, statusCode, errorMessage, code));
  }
};

//find one with tenant name function
const checkTenantExists = async (id: number, key: string): Promise<boolean> => {
  const getFunction: getFunction = getActions[key];
  const tenantExists = await getFunction(id);
  if (tenantExists.getTenant) {
    return true;
  } else {
    return false;
  }
};
