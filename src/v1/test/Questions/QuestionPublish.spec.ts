import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiSpies from 'chai-spies';
import app from '../../../app';
import { Question } from '../../models/question';
import { AppDataSource } from '../../config';

chai.use(chaiHttp);
chai.use(chaiSpies);

describe('Publish Question API', () => {
  const publishUrl = '/api/v1/question/publish';

  afterEach(() => {
    chai.spy.restore();
  });

  it('should return 200 and publish the question successfully', (done) => {
    chai.spy.on(Question, 'findOne', () => {
      return Promise.resolve({ id: 1, is_active: true, status: 'draft' });
    });
    chai.spy.on(Question, 'update', () => {
      return Promise.resolve({ status: 'live' });
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
      .post(`${publishUrl}/1`)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('successful');
        done();
      });
  });

  it('should return 404 if the question does not exist', (done) => {
    chai.spy.on(Question, 'findOne', () => {
      return Promise.resolve(null);
    });

    chai
      .request(app)
      .post(`${publishUrl}/999`)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('failed');
        res.body.responseCode.should.be.eq('RESOURCE_NOT_FOUND');
        res.body.err.err.should.be.eq('QUESTION_NOT_EXISTS');
        done();
      });
  });

  it('should return 409 if the question is already published', (done) => {
    chai.spy.on(Question, 'findOne', () => {
      return Promise.resolve({ id: 1, is_active: true, status: 'live' });
    });

    chai
      .request(app)
      .post(`${publishUrl}/3`)
      .send({ params: { msgid: 'some-message-id' } })
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

  it('should return 500 and database connection error in read', (done) => {
    chai.spy.on(Question, 'findOne', () => {
      return Promise.reject(new Error('Database Connection Error'));
    });

    chai
      .request(app)
      .post(`${publishUrl}/1`)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('failed');
        res.body.responseCode.should.be.eq('INTERNAL_SERVER_ERROR');
        res.body.err.err.should.be.eq('QUESTION_PUBLISH_FAILURE');
        done();
      });
  });
});
