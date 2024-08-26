import chai from 'chai';
import chaiHttp from 'chai-http';
import spies from 'chai-spies';
import app from '../../../app';
import { Tenant } from '../../models/tenant';
import { TenantBoard } from '../../models/tenantBoard';
import { ClassMaster } from '../../models/master_class';

chai.use(chaiHttp);
chai.use(spies);

describe('Tenant read API', () => {
  const getUrl = '/api/v1/tenant/read';

  afterEach(() => {
    chai.spy.restore();
  });

  it('should return 200 and get all the tenant details along board and class', (done) => {
    chai.spy.on(Tenant, 'findOne', () => {
      return Promise.resolve({ id: 1 });
    });
    chai.spy.on(TenantBoard, 'findAll', () => {
      return Promise.resolve({ tenant_id: 1 });
    });
    chai.spy.on(ClassMaster, 'findAll', () => {
      return Promise.resolve([
        { id: 1, is_active: true },
        { id: 2, is_active: true },
      ]);
    });
    chai
      .request(app)
      .get(`${getUrl}/1`)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('successful');
        done();
      });
  });

  it('should return 409 and Requested tenant id  does not exist', (done) => {
    chai.spy.on(Tenant, 'findAll', () => {
      return Promise.resolve(null);
    });

    chai.spy.on(TenantBoard, 'findAll', () => {
      return Promise.reject(null);
    });

    chai
      .request(app)
      .get(`${getUrl}/3`)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('failed');
        res.body.responseCode.should.be.eq('RESOURCE_NOT_FOUND');
        res.body.err.err.should.be.eq('TENANT_NOT_EXISTS');
        done();
      });
  });

  it('should return 500 and database connection error read nof', (done) => {
    chai.spy.on(Tenant, 'findAll', () => {
      return Promise.reject(new Error('Database Connection Error'));
    });
    chai.spy.on(ClassMaster, 'findAll', () => {
      return Promise.reject(new Error('Database Connection Error'));
    });

    chai
      .request(app)
      .get(`${getUrl}/1`)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('failed');
        res.body.responseCode.should.be.eq('INTERNAL_SERVER_ERROR');
        res.body.err.err.should.be.eq('TENANT_READ_FAILURE');
        done();
      });
  });
});
