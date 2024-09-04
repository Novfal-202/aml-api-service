import chai from 'chai';
import chaiHttp from 'chai-http';
import spies from 'chai-spies';
import app from '../../../app';
import { Tenant } from '../../models/tenant';

chai.use(chaiHttp);
chai.use(spies);

describe('Tenant read API', () => {
  const getUrl = '/api/v1/tenant/read';

  afterEach(() => {
    chai.spy.restore();
  });

  it('should return 200 and get all the tenant details along board and class', (done) => {
    const tenantReadMockData = [
      {
        dataValues: {
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
        _previousDataValues: {
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
        uniqno: 1,
        _changed: new Set(),
        _options: {
          isNewRecord: false,
          _schema: null,
          _schemaDelimiter: '',
          include: undefined,
          includeNames: undefined,
          includeMap: undefined,
          includeValidated: true,
          raw: true,
          attributes: undefined,
        },
        isNewRecord: false,
        tenant_boards: [
          {
            dataValues: {
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
            _previousDataValues: {
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
            uniqno: 1,
            _changed: new Set(),
            _options: {
              isNewRecord: false,
              _schema: null,
              _schemaDelimiter: '',
              include: undefined,
              includeNames: undefined,
              includeMap: undefined,
              includeValidated: true,
              raw: true,
              attributes: undefined,
            },
            isNewRecord: false,
          },
        ],
      },
    ];

    chai.spy.on(Tenant, 'findAll', () => {
      return Promise.resolve(tenantReadMockData);
    });

    chai
      .request(app)
      .get(`${getUrl}/3`)
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
    chai.spy.on(Tenant, 'findOne', () => {
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
