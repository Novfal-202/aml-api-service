import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiSpies from 'chai-spies';
import app from '../../../app';
import { Question } from '../../models/question';
import { updateQuestion } from './fixture';
import { AppDataSource } from '../../config';

chai.use(chaiHttp);
chai.use(chaiSpies);

describe('Update Question API', () => {
  const updateUrl = '/api/v1/question/update';

  afterEach(() => {
    chai.spy.restore();
  });

  it('should return 200 and update the question successfully', (done) => {
    chai.spy.on(Question, 'findOne', () => {
      return Promise.resolve({ id: 1, is_active: true });
    });
    chai.spy.on(Question, 'update', () => {
      return Promise.resolve({ tenant_name: 'Mumbai' });
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
      .post(`${updateUrl}/1`)
      .send(updateQuestion.validQuestionUpdateRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('successful');
        done();
      });
  });

  it('should return 400 if the request body is invalid for question update', (done) => {
    chai
      .request(app)
      .post(`${updateUrl}/1`)
      .send(updateQuestion.invalidQuestionUpdateRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('failed');
        res.body.responseCode.should.be.eq('CLIENT_ERROR');
        res.body.err.err.should.be.eq('QUESTION_INVALID_INPUT');
        done();
      });
  });

  it('should return 409 if the question does not exist', (done) => {
    chai.spy.on(Question, 'findOne', () => {
      return Promise.resolve(null);
    });
    chai
      .request(app)
      .post(`${updateUrl}/10`)
      .send(updateQuestion.questionNotExistsRequest)
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

  it('should return 500 and database connection error in read', (done) => {
    chai.spy.on(Question, 'findOne', () => {
      return Promise.reject(new Error('Database Connection Error'));
    });

    chai
      .request(app)
      .post(`${updateUrl}/1`)
      .send(updateQuestion.validQuestionUpdateRequest)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('failed');
        res.body.responseCode.should.be.eq('INTERNAL_SERVER_ERROR');
        res.body.err.err.should.be.eq('QUESTION_UPDATE_FAILURE');
        done();
      });
  });
});
