import { Request, Response } from 'express';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { getTenantById, updatetenant } from '../../services/tenant';
import { schemaValidation } from '../../services/validationService';
import logger from '../../utils/logger';
import { errorResponse, successResponse } from '../../utils/response';
import tenantUpdateJson from './updateTenatValidationSchema.json';

export const apiId = 'api.tenant.update';

const tenantUpdate = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');
  const tenant_id = parseInt(_.get(req, 'params.tenant_id'));
  const dataBody = _.get(req, 'body.request');
  try {
    // Validating the update schema
    const isRequestValid: Record<string, any> = schemaValidation(requestBody, tenantUpdateJson);
    if (!isRequestValid.isValid) {
      const code = 'TENANT_INVALID_INPUT';
      logger.error({ code, apiId, requestBody, message: isRequestValid.message });
      return res.status(httpStatus.BAD_REQUEST).json(errorResponse(apiId, httpStatus.BAD_REQUEST, isRequestValid.message, code));
    }

    // Validate tenant existence
    const isTenantExists = await checkTenantExists(tenant_id);

    if (!isTenantExists) {
      const code = 'TENANT_NOT_EXISTS';
      logger.error({ code, apiId, requestBody, message: `Tenant not exists with id:${tenant_id}` });
      return res.status(httpStatus.NOT_FOUND).json(errorResponse(apiId, httpStatus.NOT_FOUND, `Tenant not exists with id:${tenant_id}`, code));
    }

    await updatetenant(tenant_id, dataBody);
    return res.status(httpStatus.OK).json(successResponse(apiId, { message: 'Tenant Successfully updated' }));
  } catch (error) {
    const err = error instanceof Error;
    const code = _.get(error, 'code', 'TENANT_UPDATE_FAILURE');
    logger.error({ error, apiId, code, requestBody });
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(errorResponse(apiId, httpStatus.INTERNAL_SERVER_ERROR, err ? error.message : '', code));
  }
};

// Helper functions
const checkTenantExists = async (tenant_id: number): Promise<boolean> => {
  const tenantExists = await getTenantById(tenant_id);
  return tenantExists.getTenant && !_.isEmpty(tenantExists.getTenant);
};

export default tenantUpdate;
