import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import * as uuid from 'uuid';
import tenantCreateJson from './createTenantValidationSchema.json';
import { errorResponse, successResponse } from '../../utils/response';
// import httpStatus from 'http-status';
// import { AppDataSource } from '../../config';
import { createTenant, getTenant } from '../../services/tenantService';
import { schemaValidation } from '../../services/validationService';

export const apiId = 'api.tenant.create';

const tenantCreate = async (req: Request, res: Response) => {
  const requestBody = req.body;
  const id = uuid.v4();

  try {
    const isRequestValid: Record<string, any> = schemaValidation(req.body, tenantCreateJson);
    if (!isRequestValid.isValid) {
      const code = 'TENANT_INVALID_INPUT';
      logger.error({ code, apiId, requestBody, message: isRequestValid.message });
      return res.json(errorResponse(id, 400, isRequestValid.message, 'BAD_REQUEST'));
    }

    const tenantBody = req.body;

    const isDataSetExists = await checkDatasetExists(_.get(tenantBody, ['tenant_name']));
    if (isDataSetExists) {
      const code = 'DATASET_EXISTS';
      logger.error({ code, apiId, requestBody, message: `Dataset Already exists with id:${_.get(tenantBody, 'id')}` });
      return res.json(errorResponse(id, 409, 'BAD_REQUEST', 'CONFLICT'));
    }

    // const data = { tenantBody, version_key: Date.now().toString() };
    // tenantBody.id = uuid.v4();
    const response = await createTenant(tenantBody);
    // const responseData = { id: _.get(response, ['dataValues', 'id']) || '', version_key: data.version_key };
    logger.info({ apiId, requestBody, message: `Dataset Created Successfully with id:${_.get(response, ['dataValues', 'id'])}` });
    res.json(successResponse(id, { data: response }));
  } catch (error: any) {
    const code = _.get(error, 'code') || 'TENANT_CREATION_FAILURE';
    logger.error({ ...error, apiId, code, requestBody });
    let errorMessage = error;
    const statusCode = _.get(error, 'statusCode');
    if (!statusCode || statusCode == 500) {
      errorMessage = { code, message: 'Failed to create tenant' };
    }
    res.json(errorResponse(id, statusCode, errorMessage, code));
  }
};

const checkDatasetExists = async (tenant_name: string): Promise<boolean> => {
  const datasetExists = await getTenant(tenant_name);
  if (datasetExists) {
    return true;
  } else {
    return false;
  }
};

export default tenantCreate;
