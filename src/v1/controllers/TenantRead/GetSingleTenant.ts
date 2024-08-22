import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import * as uuid from 'uuid';
import { errorResponse, successResponse } from '../../utils/response';
import httpStatus from 'http-status';
import { getTenantwithBoard } from '../../services/tenantService';
import { getClassDetails } from '../../services/classMasterService';

export const apiId = 'api.tenant.read';

const ReadSingleTenant = async (req: Request, res: Response) => {
  const tenant_id = parseInt(_.get(req, 'params.tenant_id'));
  const id = uuid.v4();

  try {
    const getTenantInfo = await getTenantwithBoard(tenant_id);
    const TENANT = getTenantInfo?.getTenant[0].dataValues;
    if (getTenantInfo.error || _.isEmpty(getTenantInfo.getTenant)) {
      const code = 'TENANT_NOT_EXISTS';
      logger.error({ code, apiId, message: `Tenant not exists with id:${tenant_id}` });
      return res.status(httpStatus.CONFLICT).json(errorResponse(id, httpStatus.CONFLICT, `tenant id:${tenant_id} does not exists `, code));
    }
    const tenantDetails = await Promise.all(
      TENANT.tenant_boards.map(async (board: any) => {
        let classes: { message: string; error: boolean } = {
          message: '',
          error: false,
        };
        if (!_.isEmpty(board.dataValues.class_id)) {
          classes = await getClassDetails(board.dataValues.class_id);
          if (classes.error) {
            throw new Error(classes.message);
          }
        }
        return {
          ...board.get(),
          ...classes,
        };
      }),
    );
    const tenantInfo = {
      ...TENANT,
      tenant_boards: tenantDetails,
    };
    logger.info({ apiId, message: `Tenant read Successfully with id:${tenant_id}` });
    res.status(httpStatus.OK).json(successResponse(id, { data: tenantInfo }));
  } catch (error: any) {
    const code = _.get(error, 'code') || 'TENANT_READ_FAILURE';
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
