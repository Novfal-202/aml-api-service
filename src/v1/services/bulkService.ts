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
