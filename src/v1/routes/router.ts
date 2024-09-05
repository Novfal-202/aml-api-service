import express from 'express';
import { setDataToRequestObject } from '../middleware/setDataToReqObj';
import TenantCreate from '../controllers/TenantCreate/TenantCreate';
import tenantUpdate from '../controllers/TenantUpdate/updateTenant';
import ReadSingleTenant from '../controllers/TenantRead/GetSingleTenant';
import tenantSearch from '../controllers/TenantSearch/TenantSearch';
import questionCreate from '../controllers/QuestionCreate/questionCreate';
import questionUpdate from '../controllers/QuestionUpdate/questionUpdate';
import questionRead from '../controllers/QuestionRead/questionRead';
import publishQuestion from '../controllers/QuestionPublish/publishQuestion';
import deleteQuestion from '../controllers/QuestionDelete/deleteQuestion';
import discardQuestion from '../controllers/QuestionDiscard/discardQuestion';
import { searchQuestions } from '../controllers/QuestionSearch/searchQuestion';
import bulkSearch from '../controllers/BulkMasterSearch/bulkEntitySearch';
import { bulkInsert } from '../controllers/BulkMasterCreate/bulkEntityCreate';

export const router = express.Router();

router.post('/tenant/create', setDataToRequestObject('api.tenant.create'), TenantCreate);

router.post('/tenant/update/:tenant_id', setDataToRequestObject('api.tenant.update'), tenantUpdate);

router.get('/tenant/read/:tenant_id', setDataToRequestObject('api.tenant.read'), ReadSingleTenant);

router.post('/tenant/search', setDataToRequestObject('api.tenant.search'), tenantSearch);

router.post('/question/create', setDataToRequestObject('api.question.create'), questionCreate);

router.post('/question/update/:question_id', setDataToRequestObject('api.question.update'), questionUpdate);

router.get('/question/read/:question_id', setDataToRequestObject('api.question.read'), questionRead);

router.post('/question/publish/:question_id', setDataToRequestObject('api.question.publish'), publishQuestion);

router.post('/question/delete/:question_id', setDataToRequestObject('api.question.delete'), deleteQuestion);

router.post('/question/discard/:question_id', setDataToRequestObject('api.question.discard'), discardQuestion);

router.post('/question/search', setDataToRequestObject('api.question.search'), searchQuestions);

router.post('/bulk/create', setDataToRequestObject('api.bulk.create'), bulkInsert);

router.post('/bulk/search', setDataToRequestObject('api.bulk.search'), bulkSearch);
