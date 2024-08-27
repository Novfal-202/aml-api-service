import { Question } from '../models/question';
import * as _ from 'lodash';

export const getQuestionById = async (id: number): Promise<any> => {
  try {
    const whereClause: Record<string, any> = { id };
    const questionDeatils = await Question.findOne({ where: whereClause, raw: true });
    return questionDeatils;
  } catch (error: any) {
    const errorMessage = error?.message || 'failed to get a record';
    return { error: true, message: errorMessage };
  }
};

export const publishQuestionById = async (id: number): Promise<any> => {
  try {
    const questionDeatils = await Question.update({ status: 'live' }, { where: { id }, returning: true });
    return questionDeatils;
  } catch (error: any) {
    const errorMessage = error?.message || 'failed to Publish a record';
    return { error: true, message: errorMessage };
  }
};

export const deleteQuestionById = async (id: number): Promise<any> => {
  try {
    const questionDeatils = await Question.update({ is_active: false }, { where: { id }, returning: true });
    return questionDeatils;
  } catch (error: any) {
    const errorMessage = error?.message || 'failed to Publish a record';
    return { error: true, message: errorMessage };
  }
};

export const discardQuestionById = async (id: number): Promise<any> => {
  try {
    const question = await Question.destroy({
      where: { id },
    });

    return question;
  } catch (error: any) {
    const errorMessage = error?.message || 'Failed to delete question';
    return { error: true, message: errorMessage };
  }
};

export const getQuestionList = async (req: Record<string, any>) => {
  const limit: any = _.get(req, 'limit');
  const offset: any = _.get(req, 'offset');
  const { filters = {} } = req || {};
  const questions = await Question.findAll({ limit: limit || 100, offset: offset || 0, ...(filters && { where: filters }) });
  return questions;
};
