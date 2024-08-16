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

  it('Should insert tenent in to the database', (done) => {
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

    chai
      .request(app)
      .post('/api/v1/tenant/create')
      .send({
        tenant_name: 'mumbai',
        tenant_type: 'Government',
        created_by: 0,
        tenant_board: [{ name: 'State board' }, { name: 'CBSE' }],
      })
      .end((err: any, res: any) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('successful');
        done();
      });
  });

  it('Should not insert record in the database', (done) => {
    chai.spy.on(AppDataSource, 'transaction', () => {
      return Promise.reject(new Error('error occurred while connecting to the database'));
    });

    chai
      .request(app)
      .post('/api/v1/tenant/create')
      .send({
        tenant_name: 'mumbai',
        tenant_type: 'Government',
        created_by: 0,
        tenant_board: [{ name: 'State board' }, { name: 'CBSE' }],
      })
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('failed');
        done();
      });
  });

  it('Should not insert record when request object contains missing fields', (done) => {
    chai
      .request(app)
      .post('/api/v1/tenant/create')
      .send({
        tenant_type: 'Government',
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('failed');
        res.body.responseCode.should.be.eq('CLIENT_ERROR');
        res.body.err.err.should.be.eq('TENANT_INVALID_INPUT');
        done();
      });
  });

  it('Should not insert record when given invalid schema', (done) => {
    chai
      .request(app)
      .post('/api/v1/tenant/create')
      .send({
        tenant_name: 123,
        tenant_type: 'Government',
        is_active: true,
        status: 'draft',
        created_by: 'admin',
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('failed');
        res.body.responseCode.should.be.eq('CLIENT_ERROR');
        res.body.err.err.should.be.eq('TENANT_INVALID_INPUT');
        done();
      });
  });
});
