import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import { errorResponse, successResponse } from '../../utils/response';
import httpStatus from 'http-status';
import { getQuestionList } from '../../services/questionService';
import questionSearch from './questionSearchValidationSchema.json';
import { schemaValidation } from '../../services/validationService';

export const apiId = 'api.question.search';

export const searchQuestions = async (req: Request, res: Response) => {
  const requestBody = req.body;
  try {
    //validating the schema
    const isRequestValid: Record<string, any> = schemaValidation(requestBody, questionSearch);
    if (!isRequestValid.isValid) {
      const code = 'QUERY_TEMPLATE_INVALID_INPUT';
      logger.error({ code, apiId, requestBody, message: isRequestValid.message });
      return res.status(httpStatus.BAD_REQUEST).json(errorResponse(apiId, httpStatus.BAD_REQUEST, isRequestValid.message, code));
    }

    let questionData = await getQuestionList(requestBody.request);
    questionData = _.map(questionData, (data: any) => {
      return data?.dataValues;
    });
    logger.info({ apiId, requestBody, message: `Questions are listed successfully` });
    res.status(httpStatus.OK).json(successResponse(apiId, questionData));
  } catch (error: any) {
    const code = _.get(error, 'code') || 'QUESTION_SEARCH_FAILURE';
    let errorMessage = error;
    const statusCode = _.get(error, 'statusCode', 500);
    if (!statusCode || statusCode == 500) {
      errorMessage = { code, message: error.message };
    }
    logger.error({ error, apiId, code });
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(errorResponse(apiId, statusCode, errorMessage, code));
  }
};
