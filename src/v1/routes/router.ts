import express from 'express';
import { setDataToRequestObject } from '../middleware/setDataToReqObj';
import TenantCreate from '../controllers/TenantCreate/TenantController';
import tenantUpdate from '../controllers/TenantUpdate/updateTenant';

export const router = express.Router();

router.post('/tenant/create', setDataToRequestObject('api.tenant.create'), TenantCreate);

router.post('/tenant/update/:tenant_id', setDataToRequestObject('api.tenant.update'), tenantUpdate);
