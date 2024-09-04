import { Request, Response } from 'express';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { getQuestionById, updateQuestion } from '../../services/questionService';
import { schemaValidation } from '../../services/validationService';
import logger from '../../utils/logger';
import { errorResponse, successResponse } from '../../utils/response';
import questionUpdateSchema from './questionUpdateSchema.json';

export const apiId = 'api.question.update';

const questionUpdate = async (req: Request, res: Response) => {
  const requestBody = _.get(req, 'body');
  const question_id = parseInt(_.get(req, 'params.question_id'));

  const msgid = _.get(req, ['body', 'params', 'msgid']);
  const dataBody = _.get(req, 'body.request');

  try {
    // Validating the update schema
    const isRequestValid: Record<string, any> = schemaValidation(requestBody, questionUpdateSchema);
    if (!isRequestValid.isValid) {
      const code = 'QUESTION_INVALID_INPUT';
      logger.error({ code, apiId, requestBody, message: isRequestValid.message });
      return res.status(httpStatus.BAD_REQUEST).json(errorResponse(apiId, httpStatus.BAD_REQUEST, isRequestValid.message, code));
    }

    // Validate question existence
    const isQuestionExists = await checkQuestionExists(question_id);

    if (isQuestionExists === undefined) throw new Error(''); //checking the database error

    if (!isQuestionExists) {
      const code = 'QUESTION_NOT_EXISTS';
      logger.error({ code, apiId, requestBody, message: `Question not exists with id:${question_id}` });
      return res.status(httpStatus.NOT_FOUND).json(errorResponse(apiId, httpStatus.NOT_FOUND, `Question not exists with id:${question_id}`, code));
    }

    // Update Question

    const updateQuestionInfo = await updateQuestion(question_id, dataBody);

    // client Response
    if (!updateQuestionInfo.error) {
      return res.status(httpStatus.OK).json(successResponse(apiId, { message: 'Question update successfully', identifier: msgid }));
    } else throw new Error(updateQuestionInfo.message);
  } catch (error) {
    const err = error instanceof Error;
    const code = _.get(error, 'code', 'QUESTION_UPDATE_FAILURE');
    logger.error({ error, apiId, code, requestBody });
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(errorResponse(apiId, httpStatus.INTERNAL_SERVER_ERROR, err ? error.message : 'Question update failed', code));
  }
};

// Helper functions
const checkQuestionExists = async (question_id: number): Promise<boolean> => {
  const QuestionExists = await getQuestionById(question_id);
  return QuestionExists.questionDeatils && !_.isEmpty(QuestionExists.questionDeatils);
};

export default questionUpdate;
