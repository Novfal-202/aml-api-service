import { Request, Response } from 'express';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { schemaValidation } from '../../services/validationService';
import logger from '../../utils/logger';
import { errorResponse, successResponse } from '../../utils/response';
import { getEntitySearch } from '../../services/bulkService';

import bulkSearchJson from './searchBulkMaster.json';

export const apiId = 'api.bulk.search';

const bulkSearch = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');

  try {
    // Validate the request body against the schema
    const isRequestValid = schemaValidation(requestBody, bulkSearchJson);
    if (!isRequestValid.isValid) {
      const code = 'BULK_SEARCH_INVALID_INPUT';
      return res.status(400).json(errorResponse(apiId, 400, isRequestValid.message, code));
    }
    // Perform the search based on the entity type and filters
    let searchData = await getEntitySearch(requestBody.request);

    searchData = _.map(searchData, (data: any) => {
      return data?.dataValues;
    });

    logger.info({ apiId, requestBody, message: `Search completed successfully` });
    res.status(httpStatus.OK).json(successResponse(apiId, searchData));
  } catch (error: any) {
    const code = _.get(error, 'code') || 'BULK_SEARCH_FAILURE';
    const statusCode = _.get(error, 'statusCode', 500);
    const errorMessage = statusCode === 500 ? { code, message: error.message } : error;

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(errorResponse(apiId, statusCode, errorMessage, code));
  }
};

export default bulkSearch;
