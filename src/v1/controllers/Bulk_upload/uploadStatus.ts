import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import { errorResponse, successResponse } from '../../utils/response';
import httpStatus from 'http-status';
import { getQuestionSignedUrl } from '../../services/awsService';
import { getProcessById } from '../../services/process';

export const apiId = 'api.upload.status';

const uploadStatus = async (req: Request, res: Response) => {
  const process_id = _.get(req, 'params.process_id');
  try {
    const getProcessinfo = await getProcessById(process_id);
    const {
      getProcess: { fileName, status, error_message, error_status, name },
    } = getProcessinfo;

    //handle databse error
    if (getProcessinfo.error) {
      throw new Error(getProcessinfo.message);
    }

    //validating process is exist
    if (_.isEmpty(getProcessinfo.getProcess)) {
      const code = 'PROCESS_NOT_EXISTS';
      logger.error({ code, apiId, message: `process not exists with id:${process_id}` });
      return res.status(httpStatus.NOT_FOUND).json(errorResponse(apiId, httpStatus.NOT_FOUND, `Processs id:${process_id} does not exists `, code));
    }

    //signed url for upload question
    const folderpath = `upload/${process_id}`;
    const getSignedUrl = await getQuestionSignedUrl(folderpath, fileName, 5);
    const { error, message, url } = getSignedUrl;

    if (!error) {
      logger.info({ apiId, process_id, message: `signed url created successfully ` });
      return res.status(httpStatus.OK).json(successResponse(apiId, { url, status, error_message, error_status, fileName, name }));
    }
    throw new Error(message);
  } catch (error) {
    const err = error instanceof Error;
    const code = _.get(error, 'code', 'UPLOAD_STATUS_FAILURE');

    const errorMsg = err ? error.message : 'error while upload question';
    logger.error({ errorMsg, apiId, code, process_id });
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(errorResponse(apiId, httpStatus.INTERNAL_SERVER_ERROR, err ? error.message : '', code));
  }
};

export default uploadStatus;
