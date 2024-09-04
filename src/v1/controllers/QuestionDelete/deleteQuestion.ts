import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import { errorResponse, successResponse } from '../../utils/response';
import httpStatus from 'http-status';
import { getQuestionById, deleteQuestionById } from '../../services/questionService';

export const apiId = 'api.question.delete';

const deleteQuestion = async (req: Request, res: Response) => {
  const question_id = parseInt(_.get(req, 'params.question_id'));

  try {
    const questionInfo = await getQuestionById(question_id);

    if (!questionInfo || !questionInfo.questionDeatils) {
      const code = 'QUESTION_NOT_EXISTS';
      logger.error({ code, apiId, question_id, message: `No Question Found in this id:${question_id}` });
      return res.status(httpStatus.NOT_FOUND).json(errorResponse(apiId, httpStatus.NOT_FOUND, `No Question Found in this id:${question_id}`, code));
    }

    if (questionInfo.is_active === false) {
      const code = 'ERR_QUESTION_DELETE';
      logger.error({ code, apiId, question_id, message: ` Allready Question Deleted in this id:${question_id}` });
      return res.status(httpStatus.CONFLICT).json(errorResponse(apiId, httpStatus.CONFLICT, ` Allready Question Deleted in this id:${question_id}`, code));
    }

    await deleteQuestionById(question_id);

    logger.info({ apiId, question_id, message: 'Question Deleted successfully' });
    return res.status(httpStatus.OK).json(successResponse(apiId, { data: `Question Deleted Succesfully` }));
  } catch (error: any) {
    const code = _.get(error, 'code') || 'QUESTION_PUBLISH_FAILURE';
    let errorMessage = error;
    const statusCode = _.get(error, 'statusCode', 500);
    if (!statusCode || statusCode == 500) {
      errorMessage = { code, message: error.message };
    }
    logger.error({ error, apiId, code, question_id });
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(errorResponse(apiId, statusCode, errorMessage, code));
  }
};

export default deleteQuestion;
