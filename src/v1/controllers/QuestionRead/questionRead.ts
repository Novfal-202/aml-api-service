import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import { errorResponse, successResponse } from '../../utils/response';
import httpStatus from 'http-status';
import { getQuestionById } from '../../services/questionService';

export const apiId = 'api.question.read';

const questionRead = async (req: Request, res: Response) => {
  const question_id = parseInt(_.get(req, 'params.question_id'));
  try {
    const getQuestion = await getQuestionById(question_id);
    //handle databse error
    if (getQuestion.error) {
      throw new Error(getQuestion.message);
    }

    //validating tenant is exist
    if (_.isEmpty(getQuestion.questionDeatils)) {
      const code = 'QUESTION_NOT_EXISTS';
      logger.error({ code, apiId, message: `Question not exists with id:${question_id}` });
      return res.status(httpStatus.NOT_FOUND).json(errorResponse(apiId, httpStatus.NOT_FOUND, `Question id:${question_id} does not exists `, code));
    }

    //get question Details
    if (!getQuestion.error) {
      logger.info({ apiId, question_id, message: `question read Successfully with id:${question_id}` });
      const { questionDeatils } = getQuestion;
      return res.status(httpStatus.OK).json(successResponse(apiId, { questionDeatils, identifier: question_id }));
    }
    throw new Error(getQuestion.message);
  } catch (error) {
    const err = error instanceof Error;
    const code = _.get(error, 'code', 'QUESTION_READ_FAILURE');
    logger.error({ error, apiId, code, question_id });
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(errorResponse(apiId, httpStatus.INTERNAL_SERVER_ERROR, err ? error.message : '', code));
  }
};

export default questionRead;
