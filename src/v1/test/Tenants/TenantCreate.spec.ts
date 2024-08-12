import app from '../../../app';
import { Tenant } from '../../models/tenant';
import chai from 'chai';
import chaiHttp from 'chai-http';
import spies from 'chai-spies';
import { describe, it } from 'mocha';
import { AppDataSource } from '../../config';

chai.use(chaiHttp);
chai.use(spies);
chai.should();

const agent = chai.request.agent(app);

describe('TENANT CREATE API', () => {
  afterEach(() => {
    chai.spy.restore();
  });

  it('IT SHOULD INSERT A NEW TENANT ALL THE REQUEST IS PROVIDED', (done) => {
    chai.spy.on(Tenant, 'findOne', () => {
      return Promise.resolve(null);
    });
    chai.spy.on(AppDataSource, 'query', () => {
      return Promise.resolve([{ nextVal: 9 }]);
    });
    chai.spy.on(Tenant, 'create', () => {
      return Promise.resolve({});
    });
    const trns = chai.spy.on(AppDataSource, 'transaction', () => {
      return Promise.resolve(AppDataSource.transaction());
    });
    chai.spy.on(trns, 'commit', () => {
      return Promise.resolve({});
    });

    // Make the request and validate the response
    agent
      .post('/api/v1/tenant/create')
      .send({
        tenant_name: 'Karnataka',
        tenant_type: 'Government',
        is_active: true,
        status: 'draft',
        created_by: 'admin',
      })
      .end((err: any, res: any) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq(200);
        done();
      });
  });
});
