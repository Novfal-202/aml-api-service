import { Request, Response } from 'express';
import { Op } from 'sequelize';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import * as uuid from 'uuid';
import { errorResponse, successResponse } from '../../utils/response';
import httpStatus from 'http-status';
// import { getTenantById } from '../../services/tenantService';
// import { getTenantBoardById } from '../../services/tenantBoardService';
import { TenantBoard } from '../../models/tenantBoard';
import { Tenant } from '../../models/tenant';
import { ClassMaster } from '../../models/master_class';

export const apiId = 'api.tenant.read';

const ReadSingleTenant = async (req: Request, res: Response) => {
  const { tenant_id } = req.params;
  const id = uuid.v4();
  try {
    const getTenantInfo = await Tenant.findAll({
      where: {
        id: {
          [Op.or]: [tenant_id, 3],
        },
      },
      include: [
        {
          model: TenantBoard,
          // include: [
          //   {
          //     model: ClassMaster,
          //   },
          // ],
          required: false,
        },
        {
          model: ClassMaster,
        },
      ],
    });
    res.status(httpStatus.OK).json(successResponse(id, { data: getTenantInfo }));
  } catch (error: any) {
    const code = _.get(error, 'code') || 'TENANT_CREATION_FAILURE';
    let errorMessage = error;
    const statusCode = _.get(error, 'statusCode', 500);
    if (!statusCode || statusCode == 500) {
      errorMessage = { code, message: error.message };
    }
    logger.error({ error, apiId, code, tenant_id });
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(errorResponse(id, statusCode, errorMessage, code));
  }
};

export default ReadSingleTenant;
