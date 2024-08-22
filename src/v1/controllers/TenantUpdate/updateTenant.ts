import { Request, Response } from 'express';
import * as _ from 'lodash';
import * as uuid from 'uuid';
import httpStatus from 'http-status';
import { getTenantById, updatetenant } from '../../services/tenantService';
import { schemaValidation } from '../../services/validationService';
import logger from '../../utils/logger';
import { errorResponse, successResponse } from '../../utils/response';
import tenantUpdateJson from './updateTenatValidationSchema.json';
import { bulkCreateTenantBoard, getTenantBoardById, updatetenantBoard } from '../../services/tenantBoardService';

export const apiId = 'api.tenant.udpate';

type UpdateFunction = (tenant_id: number, data: any, id: number) => Promise<any>;

type getFunction = (id: number, tenant_id: number) => Promise<any>;

//update action for tenant and tenant board
const updateActions: Record<string, UpdateFunction> = {
  tenant: async (tenant_id, data) => await updatetenant(tenant_id, data),
  tenant_board_update: async (tenant_id, data, id) => await updatetenantBoard(tenant_id, data, id),
};

//get action for tenant and tenant board
const getActions: Record<string, getFunction> = {
  tenant: async (tenant_id) => await getTenantById(tenant_id),
  tenant_board_update: async (tenant_id, id) => await getTenantBoardById(tenant_id, id),
};

const tenantUpdate = async (req: Request, res: Response) => {
  const requestBody = req.body;
  const id = uuid.v4();
  const tenant_id = parseInt(_.get(req, 'params.tenant_id'));
  const key = _.keys(requestBody);
  const isBaordInsert = _.isEqual(key[0], 'tenant_board_insert');
  try {
    //validating the update schema
    const isRequestValid: Record<string, any> = schemaValidation(requestBody, tenantUpdateJson);
    if (!isRequestValid.isValid) {
      const code = 'TENANT_INVALID_INPUT';
      logger.error({ code, apiId, requestBody, message: isRequestValid.message });
      return res.status(httpStatus.BAD_REQUEST).json(errorResponse(id, httpStatus.BAD_REQUEST, isRequestValid.message, code));
    }

    //to insert tenant board
    if (isBaordInsert) {
      const tenantBoardDetails = _.map(requestBody[key[0]], (board) => {
        return _.omitBy(
          {
            name: board.name,
            tenant_id: tenant_id,
            status: board.status ?? 'draft',
            class_id: board.class_id,
            is_active: true,
            created_by: board.created_by,
          },
          // eslint-disable-next-line @typescript-eslint/unbound-method
          _.isNil,
        );
      });
      const insertTenantBoard = await bulkCreateTenantBoard(tenantBoardDetails);
      if (!insertTenantBoard.error) {
        logger.info({ apiId, requestBody, message: `Tenant board created successfully` });
        return res.status(httpStatus.CREATED).json(successResponse(id, { message: 'tenant baord create successfully', tenant_id }));
      } else {
        throw new Error('Failed to create tenant board');
      }
    }

    //validating the tenant is already exist
    const isTenantExists = await checkTenantExists(_.get(requestBody[key[0]], ['id']), tenant_id, key[0]);
    if (!isTenantExists) {
      const code = 'TENANT_NOT_EXISTS';
      logger.error({ code, apiId, requestBody, message: `${key[0]} not exists with id:${_.get(requestBody[key[0]], ['id'])}` });
      return res.status(httpStatus.CONFLICT).json(errorResponse(id, httpStatus.CONFLICT, `${key[0]} not exists with id:${_.get(requestBody[key[0]], ['id'])}`, code));
    }

    //update existing tenant or tenant board
    const updateFunction: UpdateFunction = updateActions[key[0]];
    const updateId = _.get(requestBody[key[0]], ['id']);
    const updateTenant = await updateFunction(tenant_id, _.omit(requestBody[key[0]], ['id']), updateId);
    if (!updateTenant.error) {
      logger.info({ apiId, requestBody, message: `${key[0]} update Successfully for tenant_id:${_.get(requestBody[key[0]], ['id']) || tenant_id}` });
      return res.status(httpStatus.OK).json(successResponse(id, { data: { message: `${key[0]} update Successfully`, tenant_id: tenant_id, board_id: _.get(requestBody[key[0]], ['id']) || null } }));
    }
    throw new Error(updateTenant.message);
  } catch (error: any) {
    const code = _.get(error, 'code') || 'TENANT_UPDATE_FAILURE';
    let errorMessage = error;
    const statusCode = _.get(error, 'statusCode', 500);
    if (!statusCode || statusCode == 500) {
      errorMessage = { code, message: error.message };
    }
    logger.error({ error, apiId, code, requestBody });
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(errorResponse(id, statusCode, errorMessage, code));
  }
};

//find one with tenant name function
const checkTenantExists = async (id: number, tenant_id: number, key: string): Promise<boolean> => {
  const getFunction: getFunction = getActions[key];
  const tenantExists = await getFunction(tenant_id, id);
  if (tenantExists.getTenant && !_.isEmpty(tenantExists.getTenant)) {
    return true;
  } else {
    return false;
  }
};

export default tenantUpdate;
