import { MasterBoard } from '../models/masterBoard';
import { MasterClass } from '../models/masterClass';
import { skillMaster } from '../models/skillMaster';
import { subSkillMaster } from '../models/subSkillMaster';
import { roleMaster } from '../models/roleMaster';

export const getEntitySearch = async (request: any) => {
  const { entityType, filters, limit = 10, offset = 0 } = request;

  let model;
  switch (entityType) {
    case 'skill':
      model = skillMaster;
      break;
    case 'subskill':
      model = subSkillMaster;
      break;
    case 'role':
      model = roleMaster;
      break;
    case 'class':
      model = MasterClass;
      break;
    case 'board':
      model = MasterBoard;
      break;
    default:
      throw new Error('Invalid entity type');
  }

  const data = await model.findAll({
    where: filters,
    limit,
    offset,
  });

  return data;
};

export const bulkInsertEntities = async (data: any) => {
  const { board, class: classData, skill, subskill, role } = data;

  // Helper function to handle bulk insertion
  const insertEntities = async (model: any, entities: any[], uniqueKey: string) => {
    for (const entity of entities) {
      const existingEntity = await model.findOne({
        where: { [uniqueKey]: entity[uniqueKey] },
      });

      if (!existingEntity) {
        await model.create({
          ...entity,
          status: 'live',
          is_active: true,
          created_by: 'manual',
          updated_by: null,
        });
      }
    }
  };

  try {
    if (board) {
      await insertEntities(MasterBoard, board, 'name');
    }

    if (classData) {
      await insertEntities(MasterClass, classData, 'name');
    }

    if (skill) {
      await insertEntities(skillMaster, skill, 'name');
    }

    if (subskill) {
      await insertEntities(subSkillMaster, subskill, 'name');
    }

    if (role) {
      await insertEntities(roleMaster, role, 'name');
    }
  } catch (error) {
    throw new Error(`Bulk insertion failed`);
  }
};
