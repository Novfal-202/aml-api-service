import * as uuid from 'uuid';
import { appConfiguration } from '../config/index';

const { appVersion } = appConfiguration;

interface ResponseObject {
  id: string;
  ver: string;
  ts: string;
  params: {
    resmsgid: string;
    msgid: string;
    status: string;
  };
  responseCode: string;
  result: any;
  err: {
    err: string | null;
    errmsg: string | null;
  };
}

const successResponse = (id: string, result: any): ResponseObject => {
  return {
    id,
    ver: appVersion,
    ts: new Date().toISOString(),
    params: {
      resmsgid: uuid.v4(),
      msgid: uuid.v4(),
      status: 'successful',
    },
    responseCode: 'OK',
    result,
    err: {
      err: null,
      errmsg: null,
    },
  };
};

const generateErrorResponse = (id: string, err: string, errmsg: string, responseCode: string): ResponseObject => ({
  id,
  ver: appVersion,
  ts: new Date().toISOString(),
  params: {
    resmsgid: uuid.v4(),
    msgid: uuid.v4(),
    status: 'failed',
  },
  responseCode,
  result: {},
  err: {
    err,
    errmsg,
  },
});

const errorResponse = (id: string, responseCode: number, errmsg?: string, errCode?: string): ResponseObject => {
  let resObj: ResponseObject;

  switch (responseCode) {
    case 404:
      resObj = generateErrorResponse(id, errCode || 'ERR_DATA_NOT_FOUND', errmsg || 'Data not found', 'RESOURCE_NOT_FOUND');
      break;
    case 400:
      resObj = generateErrorResponse(id, errCode || 'ERR_BAD_REQUEST', errmsg || 'Error while processing the request', 'CLIENT_ERROR');
      break;
    case 507:
      resObj = generateErrorResponse(id, errCode || 'LOW_DISK_SPACE', errmsg || 'Low Disk space', 'CLIENT_ERROR');
      break;
    case 401:
      resObj = generateErrorResponse(id, errCode || 'UNAUTHORIZED', errmsg || "You don't have permission to access this resource", 'CLIENT_ERROR');
      break;
    case 501:
      resObj = generateErrorResponse(id, 'WARNINGS_PRESENT', errmsg || 'Ran with warnings', 'WARNING');
      break;
    case 601:
      resObj = generateErrorResponse(id, 'ERR_VALIDATION_FAILED', errmsg || 'Error in request format', 'VALIDATION_ERROR');
      break;
    case 701:
      resObj = generateErrorResponse(id, 'SESSION_EXPIRED', errmsg || 'Session expired', 'SESSION_ERROR');
      break;
    case 409:
      resObj = generateErrorResponse(id, 'CONFLICT', errmsg || 'data already exist', 'CONFLICT');
      break;
    default:
      resObj = generateErrorResponse(id, errCode || 'ERR_INTERNAL_SERVER_ERROR', errmsg || 'Error while processing the request', 'INTERNAL_SERVER_ERROR');
      break;
  }

  return resObj;
};

export { successResponse, errorResponse };
