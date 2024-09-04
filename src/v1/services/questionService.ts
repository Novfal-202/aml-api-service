import { Optional } from 'sequelize';
import { AppDataSource } from '../config';
import * as _ from 'lodash';
import { Question } from '../models/question';

//create service for Question
export const createQuestion = async (req: Optional<any, string> | undefined): Promise<any> => {
  const transact = await AppDataSource.transaction();
  try {
    const insertQuestion = await Question.create(req, { transaction: transact });
    await transact.commit();
    return { error: false, insertQuestion };
  } catch (error: any) {
    await transact.rollback();
    const errorMessage = error?.message || 'failed to create a record';
    return { error: true, message: errorMessage };
  }
};

//get Single Question by name
export const getQuestionByName = async (Question_name: string): Promise<any> => {
  try {
    const getQuestion = await Question.findOne({ where: { Question_name }, raw: true });
    return { error: false, getQuestion };
  } catch (error: any) {
    const errorMessage = error?.message || 'failed to get a record';
    return { error: true, message: errorMessage };
  }
};

//update single Question
export const updateQuestion = async (id: number, req: any): Promise<any> => {
  try {
    const transact = await AppDataSource.transaction();
    const whereClause: Record<string, any> = { id };
    whereClause.is_active = true;
    const updateQuestion = await Question.update(req, { where: whereClause, transaction: transact });
    await transact.commit();
    return { error: false, updateQuestion };
  } catch (error: any) {
    const errorMessage = error?.message || 'failed to update a record';
    return { error: true, message: errorMessage };
  }
};

export const getQuestionById = async (id: number): Promise<any> => {
  try {
    const whereClause: Record<string, any> = { id, is_active: true };
    const questionDeatils = await Question.findOne({ where: whereClause, raw: true });
    return { error: false, questionDeatils };
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
