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

describe('Tenant search API', () => {
  const searchUrl = '/api/v1/tenant/search';

  afterEach(() => {
    chai.spy.restore();
  });

  it('should return 200 and get all the tenant details based on search', (done) => {
    const tenantmockData = {
      rows: [
        {
          id: 3,
          tenant_name: 'karnataka',
          tenant_type: 'government',
          is_active: true,
          status: 'draft',
          created_by: 1,
          updated_by: null,
          created_at: '2024-08-23T04:11:30.062Z',
          updated_at: '2024-08-23T04:11:30.062Z',
        },
      ],
      totalRecords: 1,
      totalPages: 1,
      currentPage: 1,
    };
    chai.spy.on(Tenant, 'findAndCountAll', () => {
      return Promise.resolve(tenantmockData);
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
    const tenantBoardMockData = {
      rows: [
        {
          id: 15,
          tenant_id: 3,
          name: 'cbse',
          status: 'draft',
          class_id: null,
          is_active: true,
          created_by: 1,
          updated_by: null,
          created_at: '2024-08-23T04:11:30.080Z',
          updated_at: '2024-08-23T04:11:30.080Z',
        },
      ],
      totalRecords: 1,
      totalPages: 1,
      currentPage: 1,
    };
    chai.spy.on(TenantBoard, 'findAndCountAll', () => {
      return Promise.resolve(tenantBoardMockData);
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
      return Promise.reject(new Error('error occurred while connecting to the database'));
    });

    chai.spy.on(TenantBoard, 'findAndCountAll', () => {
      return Promise.reject(new Error('error occurred while connecting to the database'));
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
