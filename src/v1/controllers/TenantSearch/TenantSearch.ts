import { Request, Response } from 'express';
import * as _ from 'lodash';
import httpStatus from 'http-status';
import { tenantFilter } from '../../services/tenantService';
import { schemaValidation } from '../../services/validationService';
import logger from '../../utils/logger';
import { errorResponse, successResponse } from '../../utils/response';
import tenantUpdateJson from './searchTenantValidationSchema.json';
import { UpdateTenant } from '../../types/TenantModel';
import { tenantBoardFilter } from '../../services/tenantBoardService';
import { UpdateTenantBoard } from '../../types/TenantBoard';

export const apiId = 'api.tenant.search';

type getFunction = (req: UpdateTenant | UpdateTenantBoard) => Promise<any>;
type Key = 'tenant' | 'tenant_board';
//get action for tenant and tenant board
const getActions: Record<string, getFunction> = {
  tenant: async (req) => await tenantFilter(req),
  tenant_board: async (req) => await tenantBoardFilter(req),
};

const tenantSearch = async (req: Request, res: Response) => {
  const requestBody = req.body;
  const key: Key = _.get(requestBody, 'key');
  const filterData = _.get(requestBody, ['filters']);
  try {
    // Validating the update schema
    const isRequestValid: Record<string, any> = schemaValidation(requestBody, tenantUpdateJson);
    if (!isRequestValid.isValid) {
      const code = 'TENANT_SEARCH_INVALID_INPUT';
      logger.error({ code, apiId, requestBody, message: isRequestValid.message });
      return res.status(httpStatus.BAD_REQUEST).json(errorResponse(apiId, httpStatus.BAD_REQUEST, isRequestValid.message, code));
    }

    // Validate tenant existence
    const isTenantExists = isDataExist(filterData, key);
    if (!isTenantExists) {
      const code = 'TENANT_NOT_EXISTS';
      logger.error({ code, apiId, requestBody, message: `Tenant not exists` });
      return res.status(httpStatus.NOT_FOUND).json(errorResponse(apiId, httpStatus.NOT_FOUND, `Tenant not exists`, code));
    }

    //filtre data
    const getFunction: getFunction = getActions[key];
    const getFilterData = await getFunction(filterData);
    if (!getFilterData.error) {
      logger.info({ apiId, message: `Tenant read Successfully` });
      return res.status(httpStatus.OK).json(successResponse(apiId, _.omit(getFilterData, ['error'])));
    }
    throw new Error(getFilterData.message);
  } catch (error: any) {
    const code = _.get(error, 'code', 'TENANT_SEARCH_FAILURE');
    logger.error({ error, apiId, code, requestBody });
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(errorResponse(apiId, httpStatus.INTERNAL_SERVER_ERROR, error.message, code));
  }
};

// Helper functions
const isDataExist = async (filter: UpdateTenant | UpdateTenantBoard, key: Key): Promise<boolean> => {
  const getFunction: getFunction = getActions[key];
  const tenantExists = await getFunction(filter);
  return tenantExists.getTenant && !_.isEmpty(tenantExists.tenants);
};

export default tenantSearch;
