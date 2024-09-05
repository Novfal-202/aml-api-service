import chai from 'chai';
import chaiHttp from 'chai-http';
import spies from 'chai-spies';
import app from '../../../app';
import { schemaValidation } from '../../services/validationService';
import { Question } from '../../models/question';
import { questionSearch } from './fixture';

chai.use(chaiHttp);
chai.use(spies);

describe('Question Search API', () => {
  const searchUrl = '/api/v1/question/search';

  afterEach(() => {
    chai.spy.restore();
  });

  it('should return 200 and the list of question for a valid request', (done) => {
    const mockTenantData = [
      {
        dataValues: {
          id: 1,
          name: 'kerala',
          type: 'education',
          is_active: true,
          status: 'live',
          created_by: 'system',
          created_at: '2024-09-04T11:02:26.821Z',
        },
      },
      {
        dataValues: {
          id: 2,
          name: 'tamil nadu',
          type: 'education',
          is_active: true,
          status: 'live',
          created_by: 'admin',
          created_at: '2024-09-05T11:02:26.821Z',
        },
      },
    ];

    // Mock the schema validation to return valid
    chai.spy.on(schemaValidation, 'default', () => {
      return { isValid: true };
    });

    // Mock the getTenantSearch service
    chai.spy.on(Question, 'findAll', () => {
      return Promise.resolve(mockTenantData);
    });

    chai
      .request(app)
      .post(searchUrl)
      .send(questionSearch.validQuestionSearchrequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('successful');
        res.body.responseCode.should.be.eq('OK');
        res.body.result.should.be.a('array').that.has.lengthOf(2);
        res.body.result[0].should.include({ name: 'kerala' });
        done();
      });
  });

  it('should return 400 if the request body is invalid filtre value for tenant search', (done) => {
    chai
      .request(app)
      .post(searchUrl)
      .send(questionSearch.invalidSchemaSearchRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('failed');
        res.body.responseCode.should.be.eq('CLIENT_ERROR');
        res.body.err.err.should.be.eq('QUERY_TEMPLATE_INVALID_INPUT');
        done();
      });
  });
});
