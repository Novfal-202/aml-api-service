import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import questionSchema from './questionCreateSchema.json';
import { errorResponse, successResponse } from '../../utils/response';
import httpStatus from 'http-status';
import { createQuestion } from '../../services/questionService';
import { schemaValidation } from '../../services/validationService';

export const apiId = 'api.question.create';

const questionCreate = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');
  try {
    //validating the schema
    const isRequestValid: Record<string, any> = schemaValidation(requestBody, questionSchema);
    if (!isRequestValid.isValid) {
      const code = 'QUESTION_INVALID_INPUT';
      logger.error({ code, apiId, requestBody, message: isRequestValid.message });
      return res.status(httpStatus.BAD_REQUEST).json(errorResponse(apiId, httpStatus.BAD_REQUEST, isRequestValid.message, code));
    }

    //creating a new question
    const tenantInserData = _.assign(requestBody, {
      is_active: true,
      status: 'draft',
    });
    const createNewQuestion = await createQuestion(tenantInserData);
    const question_id = _.get(createNewQuestion.insertQuestion.dataValues, ['id']);
    if (!createNewQuestion.error) {
      logger.info({ apiId, requestBody, message: `question Created Successfully with id:${question_id}` });
      return res.status(httpStatus.OK).json(successResponse(apiId, { message: 'Question Successfully created', identifier: question_id }));
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
