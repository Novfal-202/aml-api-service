import { Request, Response } from 'express';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { getTenantById, updatetenant } from '../../services/tenantService';
import { schemaValidation } from '../../services/validationService';
import logger from '../../utils/logger';
import { errorResponse, successResponse } from '../../utils/response';
import tenantUpdateJson from './updateTenatValidationSchema.json';
import { bulkCreateTenantBoard, getTenantBoardById, updatetenantBoard } from '../../services/tenantBoardService';

export const apiId = 'api.tenant.update';

interface ResultType {
  updateTenant?: boolean;
  updateTenantBoard?: boolean;
  insertTenantBoard?: boolean;
}

const tenantUpdate = async (req: Request, res: Response) => {
  const requestBody = req.body;
  const tenant_id = parseInt(_.get(req, 'params.tenant_id'));
  const tenant_board_id = _.get(requestBody.tenant_board_update, 'id');

  try {
    // Validating the update schema
    const isRequestValid: Record<string, any> = schemaValidation(requestBody, tenantUpdateJson);
    if (!isRequestValid.isValid) {
      const code = 'TENANT_INVALID_INPUT';
      logger.error({ code, apiId, requestBody, message: isRequestValid.message });
      return res.status(httpStatus.BAD_REQUEST).json(errorResponse(apiId, httpStatus.BAD_REQUEST, isRequestValid.message, code));
    }

    const result: ResultType = {};

    // Insert tenant board
    if (requestBody.tenant_board_insert) {
      const tenantBoardDetails = _.map(requestBody.tenant_board_insert, (board) => {
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
      result.insertTenantBoard = !insertTenantBoard.error;
    }

    // Validate tenant existence
    const isTenantExists = await checkTenantExists(tenant_id);
    if (!isTenantExists) {
      const code = 'TENANT_NOT_EXISTS';
      logger.error({ code, apiId, requestBody, message: `Tenant not exists with id:${tenant_id}` });
      return res.status(httpStatus.NOT_FOUND).json(errorResponse(apiId, httpStatus.NOT_FOUND, `Tenant not exists with id:${tenant_id}`, code));
    }

    // Validate tenant board existence
    const isTenantBoardExists = tenant_board_id ? await checkTenantBoardExists(tenant_board_id, tenant_id) : true;
    if (tenant_board_id && !isTenantBoardExists) {
      const code = 'TENANT_BOARD_NOT_EXISTS';
      logger.error({ code, apiId, requestBody, message: `Tenant board not exists with id:${tenant_board_id}` });
      return res.status(httpStatus.NOT_FOUND).json(errorResponse(apiId, httpStatus.NOT_FOUND, `Tenant board not exists with id:${tenant_board_id} for the tenant ${tenant_id}`, code));
    }

    // Update tenant
    if (requestBody.tenant && isTenantExists) {
      const updateTenant = await updatetenant(tenant_id, requestBody.tenant);
      result.updateTenant = !updateTenant.error;
    }

    // Update tenant board
    if (requestBody.tenant_board_update && isTenantBoardExists) {
      const updateData = _.omit(requestBody.tenant_board_update, ['id']);
      const updateTenantBoard = await updatetenantBoard(tenant_id, updateData, tenant_board_id);
      result.updateTenantBoard = !updateTenantBoard.error;
    }

    // client Response
    if (result.updateTenant || result.updateTenantBoard || result.insertTenantBoard) {
      return res.status(httpStatus.OK).json(
        successResponse(apiId, {
          message: 'Tenant update successfully',
          update_tenant: result.updateTenant,
          update_tenant_board: result.updateTenantBoard,
          insert_tenant_board: result.insertTenantBoard,
          identifier: tenant_id,
        }),
      );
    } else {
      const code = 'TENANT_UPDATE_FAILURE';
      logger.error({ apiId, requestBody, message: 'Tenant update failed' });
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(errorResponse(apiId, httpStatus.INTERNAL_SERVER_ERROR, 'Tenant update failed', code));
    }
  } catch (error) {
    const err = error instanceof Error;
    console.log('🚀 ~ tenantUpdate ~ err:', err);
    const code = _.get(error, 'code', 'TENANT_UPDATE_FAILURE');
    logger.error({ error, apiId, code, requestBody });
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(errorResponse(apiId, httpStatus.INTERNAL_SERVER_ERROR, err ? error.message : '', code));
  }
};

// Helper functions
const checkTenantExists = async (tenant_id: number): Promise<boolean> => {
  const tenantExists = await getTenantById(tenant_id);
  return tenantExists.getTenant && !_.isEmpty(tenantExists.getTenant);
};

const checkTenantBoardExists = async (tenant_board_id: number, tenant_id: number): Promise<boolean> => {
  const tenantBoardExists = await getTenantBoardById(tenant_id, tenant_board_id);
  return tenantBoardExists.getTenant && !_.isEmpty(tenantBoardExists.getTenant);
};

export default tenantUpdate;
