import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import tenantCreateJson from './createTenantValidationSchema.json';
import { errorResponse, successResponse } from '../../utils/response';
import httpStatus from 'http-status';
import { createTenant } from '../../services/tenant';
import { schemaValidation } from '../../services/validationService';
import { MasterBoard } from '../../models/masterBoard';
import { MasterClass } from '../../models/masterClass';

export const apiId = 'api.tenant.create';

const tenantCreate = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');
  try {
    //validating the schema
    const isRequestValid: Record<string, any> = schemaValidation(requestBody, tenantCreateJson);
    if (!isRequestValid.isValid) {
      const code = 'TENANT_INVALID_INPUT';
      logger.error({ code, apiId, requestBody, message: isRequestValid.message });
      return res.status(httpStatus.BAD_REQUEST).json(errorResponse(apiId, httpStatus.BAD_REQUEST, isRequestValid.message, code));
    }

    //creating a new tenant
    const tenantInserData = _.assign(requestBody, {
      status: 'draft',
      is_active: true,
    });
    const createNewTenant = await createTenant(tenantInserData);
    const tenant_id = _.get(createNewTenant.dataValues, ['id']);
    if (!createNewTenant.error) {
      logger.info({ apiId, requestBody, message: `Tenant Created Successfully with id:${tenant_id}` });
      await MasterClass.bulkCreate([
        { name: 'class-1', tenant_id, is_active: true, created_by: 1 },
        { name: 'class-2', tenant_id, is_active: true, created_by: 1 },
        { name: 'class-3', tenant_id, is_active: true, created_by: 1 },
        { name: 'class-4', tenant_id, is_active: true, created_by: 1 },
      ]);
      await MasterBoard.bulkCreate([
        { name: 'CBSE', is_active: true, created_by: 1, status: 'draft', class_id: [1, 2] },
        { name: 'SSLC', is_active: true, created_by: 1, status: 'draft', class_id: [3] },
      ]);

      return res.status(httpStatus.OK).json(successResponse(apiId, { message: 'Tenant Successfully created', identifier: tenant_id }));
    }
    throw new Error(createNewTenant.message);
  } catch (error) {
    const err = error instanceof Error;
    const code = _.get(error, 'code') || 'TENANT_CREATION_FAILURE';
    const errorMessage = err ? error.message : '';
    const statusCode = _.get(error, 'statusCode', 500);
    logger.error({ code, apiId, requestBody, message: errorMessage });
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(errorResponse(apiId, statusCode, errorMessage, code));
  }
};

export default tenantCreate;
