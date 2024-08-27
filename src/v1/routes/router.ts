import express from 'express';
import { setDataToRequestObject } from '../middleware/setDataToReqObj';
import TenantCreate from '../controllers/TenantCreate/TenantController';
import tenantUpdate from '../controllers/TenantUpdate/updateTenant';
import ReadSingleTenant from '../controllers/TenantRead/GetSingleTenant';
import tenantSearch from '../controllers/TenantSearch/TenantSearch';
import publishQuestion from '../controllers/QuestionPublish/publishQuestion';
import deleteQuestion from '../controllers/QuestionDelete/deleteQuestion';
import discardQuestion from '../controllers/QuestionDiscard/discardQuestion';
import questionCreate from '../controllers/QuestionCreate/questionCreate';
import questionRead from '../controllers/QuestionRead/questionRead';
import questionUpdate from '../controllers/QuestionUpdate/questionUpdate';

export const router = express.Router();

//tenant
router.post('/tenant/create', setDataToRequestObject('api.tenant.create'), TenantCreate);

router.post('/tenant/update/:tenant_id', setDataToRequestObject('api.tenant.update'), tenantUpdate);

router.get('/tenant/read/:tenant_id', setDataToRequestObject('api.tenant.read'), ReadSingleTenant);

router.post('/tenant/search', setDataToRequestObject('api.tenant.search'), tenantSearch);

//question
router.post('/question/create', setDataToRequestObject('api.question.create'), questionCreate);

router.post('/question/update/:question_id', setDataToRequestObject('api.question.update'), questionUpdate);

router.get('/question/read/:question_id', setDataToRequestObject('api.question.read'), questionRead);

router.post('/question/publish/:question_id', setDataToRequestObject('api.question.publish'), publishQuestion);

router.delete('/question/delete/:question_id', setDataToRequestObject('api.question.delete'), deleteQuestion);

router.delete('/question/discard/:question_id', setDataToRequestObject('api.question.discard'), discardQuestion);
