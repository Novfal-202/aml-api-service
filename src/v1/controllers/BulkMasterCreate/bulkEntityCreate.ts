import { Request, Response } from 'express';
import * as _ from 'lodash';
import { errorResponse, successResponse } from '../../utils/response';
import httpStatus from 'http-status';
import { bulkInsertEntities } from '../../services/bulkService';

export const apiId = 'api.bulk.create';
export const bulkInsert = async (req: Request, res: Response) => {
  try {
    const dataBody = _.get(req, 'body.request');

    await bulkInsertEntities(dataBody);

    return res.status(httpStatus.OK).json(successResponse(apiId, { message: 'Tenant Successfully created' }));
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
