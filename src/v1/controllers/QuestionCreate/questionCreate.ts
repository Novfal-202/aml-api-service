import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import questionSchema from './questionCreateSchema.json';
import { errorResponse, successResponse } from '../../utils/response';
import httpStatus from 'http-status';
import { createQuestion } from '../../services/questionService';
import { schemaValidation } from '../../services/validationService';
import { v4 as uuidv4 } from 'uuid';

export const apiId = 'api.question.create';

const questionCreate = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');
  const dataBody = _.get(req, 'body.request');
  try {
    //validating the schema
    const isRequestValid: Record<string, any> = schemaValidation(requestBody, questionSchema);
    if (!isRequestValid.isValid) {
      const code = 'QUESTION_INVALID_INPUT';
      logger.error({ code, apiId, requestBody, message: isRequestValid.message });
      return res.status(httpStatus.BAD_REQUEST).json(errorResponse(apiId, httpStatus.BAD_REQUEST, isRequestValid.message, code));
    }

    //creating a new question
    const tenantInserData = _.assign(dataBody, {
      is_active: true,
      status: 'draft',
      identifier: uuidv4(),
    });

    const createNewQuestion = await createQuestion(tenantInserData);

    if (!createNewQuestion.error) {
      logger.info({ apiId, requestBody, message: `question Created Successfully with id:${tenantInserData.identifier}` });
      return res.status(httpStatus.OK).json(successResponse(apiId, { message: 'Question Successfully created', identifier: tenantInserData.identifier }));
    }
    throw new Error(createNewQuestion.message);
  } catch (error) {
    const err = error instanceof Error;
    const code = _.get(error, 'code', 'QUESTION_CREATE_FAILURE');
    logger.error({ error, apiId, code, requestBody });
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(errorResponse(apiId, httpStatus.INTERNAL_SERVER_ERROR, err ? error.message : '', code));
  }
};

export default questionCreate;
