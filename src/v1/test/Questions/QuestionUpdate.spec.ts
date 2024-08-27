import chai from 'chai';
import chaiHttp from 'chai-http';
import spies from 'chai-spies';
import app from '../../../app';
import { Question } from '../../models/question';
import { questionUpdate } from './fixture';

chai.use(chaiHttp);
chai.use(spies);

describe('Question Update API', () => {
  const updateUrl = '/api/v1/question/update';

  afterEach(() => {
    chai.spy.restore();
  });

  it('should return 200 and update the question successfully', (done) => {
    const updateMockData = {
      id: 1,
      title: '5+6?',
      gradient: 'G3',
    };

    chai.spy.on(Question, 'findOne', () => {
      return Promise.resolve([updateMockData]);
    });

    chai.spy.on(Question, 'update', () => {
      return Promise.resolve(updateMockData); // Indicates that one row was updated
    });

    chai
      .request(app)
      .post(`${updateUrl}/1`)
      .send(questionUpdate.validUpdateQuestion)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('successful');
        res.body.result.identifier.should.be.eq(1);
        done();
      });
  });

  it('should return 400  when the request schema is invalid', (done) => {
    const updateMockData = {
      id: 1,
      title: '5+6?',
      gradient: 'G3',
    };

    chai.spy.on(Question, 'findOne', () => {
      return Promise.resolve([updateMockData]);
    });

    chai.spy.on(Question, 'update', () => {
      return Promise.resolve(updateMockData); // Indicates that one row was updated
    });

    chai
      .request(app)
      .post(`${updateUrl}/1`)
      .send(questionUpdate.invalidUpdateQuestion)
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

  it('should return 404 when the question ID does not exist', (done) => {
    chai.spy.on(Question, 'findOne', () => {
      return Promise.resolve([]);
    });
    chai.spy.on(Question, 'update', () => {
      return Promise.resolve([0]); // Indicates that no rows were updated
    });

    chai
      .request(app)
      .post(`${updateUrl}/2`)
      .send(questionUpdate.validUpdateQuestion)
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

  it('should return 500 when there is a database connection error', (done) => {
    chai.spy.on(Question, 'update', () => {
      return Promise.reject(new Error('Database Connection Error'));
    });

    chai
      .request(app)
      .post(`${updateUrl}/1`)
      .send(questionUpdate.validUpdateQuestion)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('failed');
        res.body.responseCode.should.be.eq('INTERNAL_SERVER_ERROR');
        res.body.err.err.should.be.eq('QUESTION_UPDATE_FAILURE');
        res.body.err.errmsg.should.be.eq('Database Connection Error');
        done();
      });
  });
});
