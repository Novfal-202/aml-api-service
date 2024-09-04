// import chai from 'chai';
// import chaiHttp from 'chai-http';
// import chaiSpies from 'chai-spies';
// import app from '../../../app';
// import { Tenant } from '../../models/tenant';
// import { MasterBoard } from '../../models/masterBoard';
// import { updateTenatTenantBoard } from './fixture';
// import { AppDataSource } from '../../config';

// chai.use(chaiHttp);
// chai.use(chaiSpies);

// describe('Tenant and TenantBoard Update API', () => {
//   const updateUrl = '/api/v1/tenant/update';

//   afterEach(() => {
//     chai.spy.restore();
//   });

//   it('should return 200 and update the tenant successfully', (done) => {
//     chai.spy.on(Tenant, 'findOne', () => {
//       return Promise.resolve({ id: 1, is_active: true });
//     });
//     chai.spy.on(Tenant, 'update', () => {
//       return Promise.resolve({ tenant_name: 'Mumbai' });
//     });

//     const transactionMock = {
//       commit: chai.spy(() => Promise.resolve({})),
//       rollback: chai.spy(() => Promise.resolve({})),
//     };

//     chai.spy.on(AppDataSource, 'transaction', () => {
//       return Promise.resolve(transactionMock);
//     });

//     chai
//       .request(app)
//       .post(`${updateUrl}/1`)
//       .send(updateTenatTenantBoard.validTenantUpdateRequest)
//       .end((err, res) => {
//         if (err) return done(err);
//         res.should.have.status(200);
//         res.body.should.be.a('object');
//         res.body.params.status.should.be.eq('successful');
//         done();
//       });
//   });

//   it('should return 400 if the request body is invalid for tenant update', (done) => {
//     chai
//       .request(app)
//       .post(`${updateUrl}/1`)
//       .send(updateTenatTenantBoard.invalidTenantUpdateRequest)
//       .end((err, res) => {
//         if (err) return done(err);
//         res.should.have.status(400);
//         res.body.should.be.a('object');
//         res.body.params.status.should.be.eq('failed');
//         res.body.responseCode.should.be.eq('CLIENT_ERROR');
//         res.body.err.err.should.be.eq('TENANT_INVALID_INPUT');
//         done();
//       });
//   });

//   it('should return 409 if the tenant does not exist', (done) => {
//     chai.spy.on(Tenant, 'findOne', () => {
//       return Promise.resolve(null);
//     });
//     chai
//       .request(app)
//       .post(`${updateUrl}/10`)
//       .send(updateTenatTenantBoard.tenantNotExistsRequest)
//       .end((err, res) => {
//         console.log(res.body)
//         if (err) return done(err);
//         res.should.have.status(404);
//         res.body.should.be.a('object');
//         res.body.params.status.should.be.eq('failed');
//         res.body.responseCode.should.be.eq('RESOURCE_NOT_FOUND');
//         res.body.err.err.should.be.eq('TENANT_NOT_EXISTS');
//         done();
//       });
//   });

// //   it('should return 500 if there is a server error during the tenant update', (done) => {
// //     chai.spy.on(AppDataSource, 'transaction', () => {
// //       return Promise.reject(new Error('error occurred while connecting to the database'));
// //     });
// //     chai.spy.on(Tenant, 'update', () => {
// //       return Promise.reject(new Error('error occurred while connecting to the database'));
// //     });
// //     chai.spy.on(MasterBoard, 'update', () => {
// //       return Promise.reject(new Error('error occurred while connecting to the database'));
// //     });
// //     const {
// //       validTenantUpdateRequest: { request },
// //     } = updateTenatTenantBoard;
// //     chai
// //       .request(app)
// //       .post(`${updateUrl}/10`)
// //       .send(updateTenatTenantBoard.validTenantUpdateRequest )
// //       .end((err, res) => {
// //         if (err) return done(err);
// //         res.should.have.status(500);
// //         res.body.should.be.a('object');
// //         res.body.params.status.should.be.eq('failed');
// //         res.body.responseCode.should.be.eq('INTERNAL_SERVER_ERROR');
// //         res.body.err.err.should.be.eq('TENANT_UPDATE_FAILURE');
// //         res.body.err.errmsg.should.be.eq('error occurred while connecting to the database');
// //         done();
// //       });
// //   });
// });
