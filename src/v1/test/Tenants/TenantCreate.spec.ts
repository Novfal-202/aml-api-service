import app from '../../../app';
import { Tenant } from '../../models/tenant';
import chai from 'chai';
import chaiHttp from 'chai-http';
import spies from 'chai-spies';
import { describe, it } from 'mocha';
import { AppDataSource } from '../../config';

chai.use(spies);
chai.should();
chai.use(chaiHttp);

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

    const transactionMock = {
      commit: chai.spy(() => Promise.resolve({})),
      rollback: chai.spy(() => Promise.resolve({})),
    };

    chai.spy.on(AppDataSource, 'transaction', () => {
      return Promise.resolve(transactionMock);
    });

    // Make the request and validate the response
    chai
      .request(app)
      .post('/api/v1/tenant/create')
      .send({
        tenant_name: 'mumbai',
        tenant_type: 'Government',
        is_active: true,
        status: 'draft',
        created_by: 'admin',
      })
      .end((err: any, res: any) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('successful');
        done();
      });
  });
});
