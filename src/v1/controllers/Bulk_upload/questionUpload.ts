import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import * as uuid from 'uuid';
import { errorResponse, successResponse } from '../../utils/response';
import httpStatus from 'http-status';
import { schemaValidation } from '../../services/validationService';
import templateSchema from './questionUploadSchema.json';
import { uploadSignedUrl } from '../../services/awsService';
import { createProcess } from '../../services/process';

export const apiIdUpload = 'api.upload.question';

const uploadQuestion = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');
  const { folderName, fileName, description, expiryTime } = requestBody;
  try {
    //validating the schema
    const isRequestValid: Record<string, any> = schemaValidation(requestBody, templateSchema);
    if (!isRequestValid.isValid) {
      const code = 'TEMPLATE_INVALID_INPUT';
      logger.error({ code, apiIdUpload, requestBody, message: isRequestValid.message });
      return res.status(httpStatus.BAD_REQUEST).json(errorResponse(apiIdUpload, httpStatus.BAD_REQUEST, isRequestValid.message, code));
    }

    //creating process id
    const process_id = uuid.v4();

    //signed url for upload question
    const getSignedUrl = await uploadSignedUrl(folderName, process_id, fileName, expiryTime);
    const { error, message, url, name } = getSignedUrl;

    if (!error) {
      const insertProcess = await createProcess({
        process_id: process_id,
        folderName: folderName,
        name: fileName,
        fileName: name,
        status: 'in_progres',
        description,
        is_active: true,
        created_by: 1,
      });
      if (insertProcess.error) {
        throw new Error(insertProcess.message);
      }
      logger.info({ apiIdUpload, requestBody, message: `signed url created successfully ` });
      return res.status(httpStatus.OK).json(successResponse(apiIdUpload, { message, url, name, process_id }));
    }
    throw new Error(message);
  } catch (error) {
    const err = error instanceof Error;
    const code = _.get(error, 'code', 'TEMPLATE_GET_FAILURE');
    const errorMsg = err ? error.message : 'error while upload question';
    logger.error({ errorMsg, apiIdUpload, code, requestBody });
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(errorResponse(apiIdUpload, httpStatus.INTERNAL_SERVER_ERROR, err ? error.message : '', code));
  }
};

export default uploadQuestion;
