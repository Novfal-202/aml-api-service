import chai from 'chai';
import chaiHttp from 'chai-http';
import spies from 'chai-spies';
import app from '../../../app';
import { schemaValidation } from '../../services/validationService';
import { Tenant } from '../../models/tenant';

chai.use(chaiHttp);
chai.use(spies);

describe('Tenant Search API', () => {
  const searchUrl = '/api/v1/tenant/search';

  afterEach(() => {
    chai.spy.restore();
  });

  it('should return 200 and the list of tenants for a valid request', (done) => {
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
    ];

    // Mock the schema validation to return valid
    chai.spy.on(schemaValidation, 'default', () => {
      return { isValid: true };
    });

    // Mock the getTenantSearch service
    chai.spy.on(Tenant, 'findAll', () => {
      return Promise.resolve(mockTenantData);
    });

    const requestBody = {
      id: 'api.tenant.search',
      ver: '1.0',
      ts: '2024-09-03T12:34:56Z',
      params: {
        msgid: '123e4567-e89b-12d3-a456-426614174000',
      },
      request: {
        filters: { name: 'kerala' },
        limit: 10,
        offset: 0,
      },
    };

    chai
      .request(app)
      .post(searchUrl)
      .send(requestBody)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('successful');
        res.body.responseCode.should.be.eq('OK');
        res.body.result.should.be.a('array').that.has.lengthOf(1);
        res.body.result[0].should.include({ name: 'kerala' });
        done();
      });
  });
});
