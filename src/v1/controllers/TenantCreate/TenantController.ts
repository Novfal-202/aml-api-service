import { Request, Response } from 'express';
import logger from '../../utils/logger';
import * as _ from 'lodash';
import tenantCreateJson from './createTenantValidationSchema.json';
import { errorResponse, successResponse } from '../../utils/response';
import httpStatus from 'http-status';
import { createTenant } from '../../services/tenantService';
import { schemaValidation } from '../../services/validationService';
import { bulkCreateTenantBoard } from '../../services/tenantBoardService';

export const apiId = 'api.tenant.create';

const tenantCreate = async (req: Request, res: Response) => {
  const requestBody = req.body;
  try {
    //validating the schema
    const isRequestValid: Record<string, any> = schemaValidation(requestBody, tenantCreateJson);
    if (!isRequestValid.isValid) {
      const code = 'TENANT_INVALID_INPUT';
      logger.error({ code, apiId, requestBody, message: isRequestValid.message });
      return res.status(httpStatus.BAD_REQUEST).json(errorResponse(apiId, httpStatus.BAD_REQUEST, isRequestValid.message, code));
    }

    //creating a new tenant
    const tenantInserData = _.assign(_.omit(requestBody, ['tenant_board']), {
      status: 'draft',
      is_active: true,
    });
    const createNewTenant = await createTenant(tenantInserData);
    const tenant_id = _.get(createNewTenant.insertTenant.dataValues, ['id']);
    if (!createNewTenant.error) {
      logger.info({ apiId, requestBody, message: `Tenant Created Successfully with id:${tenant_id}` });
      const tenantBoard = _.get(req.body, 'tenant_board', []);
      const tenantBoardDetails = _.map(tenantBoard, (board) => {
        return _.omitBy(
          {
            name: board.name,
            tenant_id: tenant_id,
            status: board.status ?? 'draft',
            class_id: board.class_id,
            is_active: tenantInserData.is_active,
            created_by: tenantInserData.created_by,
          },
          // eslint-disable-next-line @typescript-eslint/unbound-method
          _.isNil,
        );
      });

      await bulkCreateTenantBoard(tenantBoardDetails);
      return res.status(httpStatus.OK).json(successResponse(apiId, { data: { message: 'Tenant Successfully created', tenant_id: tenant_id } }));
    }
    throw new Error(createNewTenant.message);
  } catch (error: any) {
    const code = _.get(error, 'code') || 'TENANT_CREATION_FAILURE';
    let errorMessage = error;
    const statusCode = _.get(error, 'statusCode', 500);
    if (!statusCode || statusCode == 500) {
      errorMessage = { code, message: error.message };
    }
    logger.error({ error, apiId, code, requestBody });
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(errorResponse(apiId, statusCode, errorMessage, code));
  }
};

export default tenantCreate;
