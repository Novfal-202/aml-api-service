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
    const tenantReadMockData = {
      id: 1,
      tenant_name: 'karnataka',
      tenant_type: 'government',
      is_active: true,
      status: 'approved',
      created_by: 1,
      updated_by: 1,
      created_at: '2024-08-22T10:21:52.287Z',
      updated_at: '2024-08-23T06:11:34.267Z',
      tenant_boards: [
        {
          id: 74,
          tenant_id: 1,
          name: 'new Board',
          status: 'draft',
          class_id: null,
          is_active: true,
          created_by: 1,
          updated_by: null,
          created_at: '2024-08-26T06:04:52.944Z',
          updated_at: '2024-08-26T06:04:52.944Z',
          message: '',
          error: false,
        },
        {
          id: 1,
          tenant_id: 1,
          name: 'Updated Board',
          status: 'draft',
          class_id: [1, 2],
          is_active: true,
          created_by: 1,
          updated_by: 1,
          created_at: '2024-08-22T10:21:52.316Z',
          updated_at: '2024-08-26T12:00:25.667Z',
          error: false,
          classDetails: [
            {
              id: 1,
              name: 'class-1',
              prerequisites: null,
              description: null,
              tenant_id: 1,
              is_active: true,
              created_by: '1',
              updated_by: null,
              created_at: '2024-08-22T10:21:52.324Z',
              updated_at: '2024-08-22T10:21:52.324Z',
            },
            {
              id: 2,
              name: 'class-2',
              prerequisites: null,
              description: null,
              tenant_id: 1,
              is_active: true,
              created_by: '1',
              updated_by: null,
              created_at: '2024-08-22T10:21:52.324Z',
              updated_at: '2024-08-22T10:21:52.324Z',
            },
          ],
        },
        {
          id: 129,
          tenant_id: 1,
          name: 'new Board',
          status: 'draft',
          class_id: null,
          is_active: true,
          created_by: 1,
          updated_by: null,
          created_at: '2024-08-26T12:00:25.702Z',
          updated_at: '2024-08-26T12:00:25.702Z',
          message: '',
          error: false,
        },
      ],
    };
    chai.spy.on(Tenant, 'findOne', () => {
      return Promise.resolve(tenantReadMockData);
    });
    chai.spy.on(ClassMaster, 'findAll', () => {
      return Promise.resolve([
        {
          id: 1,
          name: 'class-1',
          prerequisites: null,
          description: null,
          tenant_id: 1,
          is_active: true,
          created_by: '1',
          updated_by: null,
          created_at: '2024-08-22T10:21:52.324Z',
          updated_at: '2024-08-22T10:21:52.324Z',
        },
        {
          id: 2,
          name: 'class-2',
          prerequisites: null,
          description: null,
          tenant_id: 1,
          is_active: true,
          created_by: '1',
          updated_by: null,
          created_at: '2024-08-22T10:21:52.324Z',
          updated_at: '2024-08-22T10:21:52.324Z',
        },
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

  it('should return 500 and database connection error in read', (done) => {
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
