import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import tenantCreateJson from './createTenantValidationSchema.json';
import { errorResponse, successResponse } from '../../utils/response';
import httpStatus from 'http-status';
import { createTenant } from '../../services/tenant';
import { schemaValidation } from '../../services/validationService';

export const apiId = 'api.tenant.create';

const tenantCreate = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');

  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const dataBody = _.get(req, 'body.request');
  try {
    //validating the schema
    const isRequestValid: Record<string, any> = schemaValidation(requestBody, tenantCreateJson);
    if (!isRequestValid.isValid) {
      const code = 'TENANT_INVALID_INPUT';
      logger.error({ code, apiId, msgid, requestBody, message: isRequestValid.message });
      return res.status(httpStatus.BAD_REQUEST).json(errorResponse(apiId, httpStatus.BAD_REQUEST, isRequestValid.message, code));
    }

    const tenantInsertData = {
      ...dataBody,
      status: 'live',
      created_by: 'system',
      is_active: true,
    };

    const createNewTenant = await createTenant(tenantInsertData);

    return res.status(httpStatus.OK).json(successResponse(apiId, { message: 'Tenant Successfully created', identifier: createNewTenant.id }));
  } catch (error: any) {
    const code = _.get(error, 'code') || 'TENANT_CREATE_FAILURE';
    let errorMessage = error;
    const statusCode = _.get(error, 'statusCode', 500);
    if (!statusCode || statusCode == 500) {
      errorMessage = { code, message: error.message };
    }
    // logger.error({ error, apiId, code, question_id });
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(errorResponse(apiId, statusCode, errorMessage, code));
  }
};

export default tenantCreate;
