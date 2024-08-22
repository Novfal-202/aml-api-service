// import { AppDataSource } from '../config';
import { Op } from 'sequelize';
import { ClassMaster } from '../models/master_class';

export const getClassDetails = async (classIds: number[]): Promise<any> => {
  try {
    const classDetails = await ClassMaster.findAll({
      where: {
        id: {
          [Op.in]: classIds,
        },
        is_active: true,
      },
    });

    return { error: false, classDetails };
  } catch (error: any) {
    const errorMessage = error?.message || 'failed to get a record';
    return { error: true, message: errorMessage };
  }
};
