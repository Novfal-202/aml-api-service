import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import { errorResponse, successResponse } from '../../utils/response';
import httpStatus from 'http-status';
import { getTenantwithBoard } from '../../services/tenant';
import { getClassDetails } from '../../services/masterClass';

export const apiId = 'api.tenant.read';

const ReadSingleTenant = async (req: Request, res: Response) => {
  const tenant_id = parseInt(_.get(req, 'params.tenant_id'));

  try {
    const getTenantInfo = await getTenantwithBoard(tenant_id);

    //handle databse error
    if (getTenantInfo.error) {
      throw new Error(getTenantInfo.message);
    }
    const TENANT = getTenantInfo.tenant.dataValues;

    //validating tenant is exist
    if (_.isEmpty(TENANT)) {
      const code = 'TENANT_NOT_EXISTS';
      logger.error({ code, apiId, message: `Tenant not exists with id:${tenant_id}` });
      return res.status(httpStatus.NOT_FOUND).json(errorResponse(apiId, httpStatus.NOT_FOUND, `tenant id:${tenant_id} does not exists `, code));
    }

    //get the tenat along with tenant board and class
    let tenantDetails = [];
    if (!_.isEmpty(TENANT.boards)) {
      tenantDetails = await Promise.all(
        TENANT.boards.map(async (board: any) => {
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
    }
    const tenantInfo = {
      ...TENANT,
      tenant_boards: tenantDetails || [],
    };
    logger.info({ apiId, message: `Tenant read Successfully with id:${tenant_id}` });
    res.status(httpStatus.OK).json(successResponse(apiId, tenantInfo));
  } catch (error: any) {
    const code = _.get(error, 'code') || 'TENANT_READ_FAILURE';
    let errorMessage = error;
    const statusCode = _.get(error, 'statusCode', 500);
    if (!statusCode || statusCode == 500) {
      errorMessage = { code, message: error.message };
    }
    logger.error({ error, apiId, code, tenant_id });
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(errorResponse(apiId, statusCode, errorMessage, code));
  }
};

export default ReadSingleTenant;
