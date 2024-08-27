import express from 'express';
import { setDataToRequestObject } from '../middleware/setDataToReqObj';
import TenantCreate from '../controllers/TenantCreate/TenantController';
import tenantUpdate from '../controllers/TenantUpdate/updateTenant';
import ReadSingleTenant from '../controllers/TenantRead/GetSingleTenant';
import tenantSearch from '../controllers/TenantSearch/TenantSearch';
import publishQuestion from '../controllers/QuestionPublish/publishQuestion';
import deleteQuestion from '../controllers/QuestionDelete/deleteQuestion';
import discardQuestion from '../controllers/QuestionDiscard/discardQuestion';
import { searchQuestions } from '../controllers/QuestionSearch/searchQuestion';

export const router = express.Router();

router.post('/tenant/create', setDataToRequestObject('api.tenant.create'), TenantCreate);

router.post('/tenant/update/:tenant_id', setDataToRequestObject('api.tenant.update'), tenantUpdate);

router.get('/tenant/read/:tenant_id', setDataToRequestObject('api.tenant.read'), ReadSingleTenant);

router.post('/tenant/search', setDataToRequestObject('api.tenant.search'), tenantSearch);

router.post('/question/publish/:question_id', setDataToRequestObject('api.question.publish'), publishQuestion);

router.post('/question/search/', setDataToRequestObject('api.question.search'), searchQuestions);

router.delete('/question/delete/:question_id', setDataToRequestObject('api.question.delete'), deleteQuestion);

router.delete('/question/discard/:question_id', setDataToRequestObject('api.question.discard'), discardQuestion);
