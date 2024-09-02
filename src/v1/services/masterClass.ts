import { Op } from 'sequelize';
import { MasterClass } from '../models/masterClass';

export const getClassDetails = async (classIds: number[]): Promise<any> => {
  try {
    const classDetails = await MasterClass.findAll({
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
