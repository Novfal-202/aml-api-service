import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import * as uuid from 'uuid';
import tenantCreateJson from './createTenantValidationSchema.json';
import { errorResponse, successResponse } from '../../utils/response';
import httpStatus from 'http-status';
import { createTenant, getTenant } from '../../services/tenantService';
import { schemaValidation } from '../../services/validationService';

export const apiId = 'api.tenant.create';

const tenantCreate = async (req: Request, res: Response) => {
  const requestBody = req.body;
  const id = uuid.v4();
  try {
    //validating the schema
    const isRequestValid: Record<string, any> = schemaValidation(requestBody, tenantCreateJson);
    if (!isRequestValid.isValid) {
      const code = 'TENANT_INVALID_INPUT';
      logger.error({ code, apiId, requestBody, message: isRequestValid.message });
      return res.status(httpStatus.BAD_REQUEST).json(errorResponse(id, httpStatus.BAD_REQUEST, isRequestValid.message, code));
    }

    //validating the tenat is already exist
    const isTenantExists = await checkTenantExists(_.get(requestBody, ['tenant_name']));
    if (isTenantExists) {
      const code = 'TENANT_EXISTS';
      logger.error({ code, apiId, requestBody, message: `Tenant Already exists with name:${_.get(requestBody, ['tenant_name'])}` });
      return res.status(httpStatus.CONFLICT).json(errorResponse(id, httpStatus.CONFLICT, `Tenant Already exists with name:${_.get(requestBody, ['tenant_name'])}`, code));
    }

    //creating a new tenant
    const createNewTenant = await createTenant(requestBody);
    logger.info({ apiId, requestBody, message: `Tenant Created Successfully with id:${_.get(createNewTenant, ['tenant_name', 'id'])}` });
    return res.status(httpStatus.OK).json(successResponse(id, { data: createNewTenant }));
  } catch (error: any) {
    const code = _.get(error, 'code') || 'TENANT_CREATION_FAILURE';
    let errorMessage = error;
    const statusCode = _.get(error, 'statusCode');
    if (!statusCode || statusCode == 500) {
      errorMessage = { code, message: 'Failed to create tenant' };
    }
    logger.error({ error, apiId, code, requestBody });
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(errorResponse(id, statusCode, errorMessage, code));
  }
};

//find one with tenant name function
const checkTenantExists = async (tenant_name: string): Promise<boolean> => {
  const tenantExists = await getTenant(tenant_name);
  if (tenantExists) {
    return true;
  } else {
    return false;
  }
};

export default tenantCreate;
