import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiSpies from 'chai-spies';
import app from '../../../app';
import { Tenant } from '../../models/tenant';
import { TenantBoard } from '../../models/tenantBoard';
import { updateTenatTenantBoard } from './fixture';

chai.use(chaiHttp);
chai.use(chaiSpies);
const { spy } = chai;

describe('Tenant and TenantBoard Update API', () => {
  const updateUrl = '/api/v1/tenant/update';

  afterEach(() => {
    spy.restore();
  });

  it('should return 200 and update the tenant successfully', (done) => {
    chai.spy.on(Tenant, 'findOne', () => {
      return Promise.resolve({ id: 1 });
    });
    chai.spy.on(Tenant, 'update', () => {
      return Promise.resolve({ tenant_name: 'Mumbai' });
    });

    chai
      .request(app)
      .post(`${updateUrl}/1`)
      .send(updateTenatTenantBoard.validTenantUpdateRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('successful');
        done();
      });
  });

  it('should return 200 and update the tenant board successfully', (done) => {
    chai.spy.on(TenantBoard, 'findOne', () => {
      return Promise.resolve({ id: 1, tenant_id: 1 });
    });
    chai.spy.on(TenantBoard, 'update', () => {
      return Promise.resolve({ name: 'CBSE' });
    });
    chai
      .request(app)
      .post(`${updateUrl}/1`)
      .send(updateTenatTenantBoard.validTenantBoardUpdateRequest)
      .end((err, res) => {
        console.log('🚀 ~ .end ~ res:', res.body);
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('successful');
        done();
      });
  });

  it('should return 200 and update the multiple tenant board successfully', (done) => {
    chai.spy.on(TenantBoard, 'findAll', () => {
      return Promise.resolve({ tenant_id: 1 });
    });
    chai.spy.on(TenantBoard, 'update', () => {
      return Promise.resolve({ name: 'CBSE' });
    });
    chai
      .request(app)
      .post(`${updateUrl}/1`)
      .send(updateTenatTenantBoard.validTenantBoardMultiUpdateRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('successful');
        done();
      });
  });

  it('should return 200 and insert the tenant board successfully', (done) => {
    chai.spy.on(TenantBoard, 'findOne', () => {
      return Promise.resolve(null);
    });
    chai.spy.on(TenantBoard, 'create', () => {
      return Promise.resolve({});
    });
    chai
      .request(app)
      .post(`${updateUrl}/1`)
      .send(updateTenatTenantBoard.validTenantBoardInsertRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('successful');
        done();
      });
  });

  it('should return 400 if the request body is invalid for tenant update', (done) => {
    chai
      .request(app)
      .post(`${updateUrl}/1`)
      .send(updateTenatTenantBoard.invalidTenantUpdateRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('failed');
        res.body.responseCode.should.be.eq('CLIENT_ERROR');
        res.body.err.err.should.be.eq('TENANT_INVALID_INPUT');
        done();
      });
  });

  it('should return 400 if the request body is invalid for tenant board update', (done) => {
    chai
      .request(app)
      .post(`${updateUrl}/1`)
      .send(updateTenatTenantBoard.invalidTenantBoardUpdateRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('failed');
        res.body.responseCode.should.be.eq('CLIENT_ERROR');
        res.body.err.err.should.be.eq('TENANT_INVALID_INPUT');
        done();
      });
  });

  it('should return 400 if the request body is invalid for tenant board insert', (done) => {
    chai
      .request(app)
      .post(`${updateUrl}/1`)
      .send(updateTenatTenantBoard.invalidTenantBoardInsertRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('failed');
        res.body.responseCode.should.be.eq('CLIENT_ERROR');
        res.body.err.err.should.be.eq('TENANT_INVALID_INPUT');
        done();
      });
  });

  it('should return 409 if the tenant does not exist', (done) => {
    chai.spy.on(Tenant, 'findOne', () => {
      return Promise.resolve(null);
    });
    chai
      .request(app)
      .post(`${updateUrl}/10`)
      .send(updateTenatTenantBoard.tenantNotExistsRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(409);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('failed');
        res.body.responseCode.should.be.eq('CONFLICT');
        res.body.err.err.should.be.eq('CONFLICT');
        done();
      });
  });

  it('should return 409 if the tenant board  does not exist while update', (done) => {
    chai.spy.on(TenantBoard, 'findOne', () => {
      return Promise.resolve(null);
    });
    chai
      .request(app)
      .post(`${updateUrl}/10`)
      .send(updateTenatTenantBoard.tenantBoardNotExistRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(409);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('failed');
        res.body.responseCode.should.be.eq('CONFLICT');
        res.body.err.err.should.be.eq('CONFLICT');
        done();
      });
  });

  it('should return 500 if there is a server error during the tenant update', (done) => {
    chai.spy.on(Tenant, 'findOne', () => {
      return Promise.resolve({ id: 1 });
    });
    chai.spy.on(Tenant, 'update', () => {
      return Promise.reject();
    });

    chai
      .request(app)
      .post(`${updateUrl}/1`)
      .send(updateTenatTenantBoard.validTenantUpdateRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('failed');
        res.body.responseCode.should.be.eq('INTERNAL_SERVER_ERROR');
        res.body.err.err.should.be.eq('TENANT_UPDATE_FAILURE');
        res.body.err.errmsg.message.should.be.eq('failed to update a record');
        done();
      });
  });
});
