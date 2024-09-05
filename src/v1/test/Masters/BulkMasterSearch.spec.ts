import app from '../../../app';
import chai from 'chai';
import chaiHttp from 'chai-http';
import spies from 'chai-spies';
import { describe, it } from 'mocha';
import { schemaValidation } from '../../services/validationService';

chai.use(spies);
chai.should();
chai.use(chaiHttp);

describe('Bulk Search API', () => {
  const searchUrl = '/api/v1/bulk/search';

  afterEach(() => {
    chai.spy.restore();
  });

  it('should return 400 for invalid input', (done) => {
    chai.spy.on(schemaValidation, 'default', () => {
      return { isValid: false, message: 'Invalid input schema' };
    });

    chai
      .request(app)
      .post(searchUrl)
      .send({
        id: 'api.bulk.search',
        ver: '1.0',
        ts: new Date().toISOString(),
        params: { msgid: 'test-msg-id' },
        request: {
          entityType: 'invalidEntityType',
          filters: {},
          limit: 10,
          offset: 0,
        },
      })
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('failed');
        res.body.responseCode.should.be.eq('CLIENT_ERROR');
        res.body.err.err.should.be.eq('BULK_SEARCH_INVALID_INPUT');
        done();
      });
  });
});
