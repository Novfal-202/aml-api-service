import chai from 'chai';
import chaiHttp from 'chai-http';
import spies from 'chai-spies';
import app from '../../../app';
import { Tenant } from '../../models/tenant';
import { TenantBoard } from '../../models/tenantBoard';
import { tenantSearch } from './fixture';
import { AppDataSource } from '../../config';

chai.use(chaiHttp);
chai.use(spies);

describe('Tenant read API', () => {
  const searchUrl = '/api/v1/tenant/search';

  afterEach(() => {
    chai.spy.restore();
  });

  it('should return 200 and get all the tenant details based on search', (done) => {
    chai.spy.on(Tenant, 'findAndCountAll', () => {
      return Promise.resolve({ tenant_type: 'government' });
    });
    chai
      .request(app)
      .post(searchUrl)
      .send(tenantSearch.validTenantSearchrequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('successful');
        done();
      });
  });

  it('should return 200 and get all the tenant board details with class info based on search', (done) => {
    chai.spy.on(TenantBoard, 'findAndCountAll', () => {
      return Promise.resolve({ status: 'draft' });
    });
    chai
      .request(app)
      .post(searchUrl)
      .send(tenantSearch.validTenantBoardSearchRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('successful');
        done();
      });
  });

  it('should return 400 if the request body is invalid key for tenant search', (done) => {
    chai
      .request(app)
      .post(searchUrl)
      .send(tenantSearch.invalidSchemaSearchRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('failed');
        res.body.responseCode.should.be.eq('CLIENT_ERROR');
        res.body.err.err.should.be.eq('TENANT_SEARCH_INVALID_INPUT');
        done();
      });
  });

  it('should return 400 if the request body is invalid filtre value for tenant search', (done) => {
    chai
      .request(app)
      .post(searchUrl)
      .send(tenantSearch.invalidTenantBoardSearchRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('failed');
        res.body.responseCode.should.be.eq('CLIENT_ERROR');
        res.body.err.err.should.be.eq('TENANT_SEARCH_INVALID_INPUT');
        done();
      });
  });

  it('should return 500 and database connection error', (done) => {
    chai.spy.on(AppDataSource, 'transaction', () => {
      return Promise.reject(new Error('error occurred while connecting to the database'));
    });
    chai.spy.on(Tenant, 'findAll', () => {
      return Promise.reject(new Error('Database Connection Error'));
    });

    chai
      .request(app)
      .post(searchUrl)
      .send(tenantSearch.validTenantSearchrequest)

      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('failed');
        res.body.responseCode.should.be.eq('INTERNAL_SERVER_ERROR');
        res.body.err.err.should.be.eq('TENANT_SEARCH_FAILURE');
        done();
      });
  });
});
