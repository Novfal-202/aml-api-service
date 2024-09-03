import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
// import * as uuid from 'uuid';
import { errorResponse, successResponse } from '../../utils/response';
import httpStatus from 'http-status';
import { schemaValidation } from '../../services/validationService';
import templateSchema from './templateSchema.json';
import { getTemplateSignedUrl } from '../../services/awsService';

export const apiId = 'api.get.template';

const getTemplate = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');
  const { folderName, fileName, expiryTime } = requestBody;
  try {
    //validating the schema
    const isRequestValid: Record<string, any> = schemaValidation(requestBody, templateSchema);
    if (!isRequestValid.isValid) {
      const code = 'TEMPLATE_INVALID_INPUT';
      logger.error({ code, apiId, requestBody, message: isRequestValid.message });
      return res.status(httpStatus.BAD_REQUEST).json(errorResponse(apiId, httpStatus.BAD_REQUEST, isRequestValid.message, code));
    }

    //signed url for downlaod template
    const getSignedUrl = await getTemplateSignedUrl(folderName, fileName, expiryTime);
    const { error, message, url } = getSignedUrl;

    if (!error) {
      logger.info({ apiId, requestBody, message: `signed url created successfully ` });
      return res.status(httpStatus.OK).json(successResponse(apiId, { url, fileName }));
    }
    throw new Error(message);
  } catch (error) {
    const err = error instanceof Error;
    const code = _.get(error, 'code', 'TEMPLATE_GET_FAILURE');
    const errorMsg = err ? error.message : 'error while get template';
    logger.error({ errorMsg, apiId, code, requestBody });
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(errorResponse(apiId, httpStatus.INTERNAL_SERVER_ERROR, err ? error.message : '', code));
  }
};

export default getTemplate;
