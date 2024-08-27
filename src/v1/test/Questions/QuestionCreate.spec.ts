import app from '../../../app';
import { Question } from '../../models/question';
import chai from 'chai';
import chaiHttp from 'chai-http';
import spies from 'chai-spies';
import { describe, it } from 'mocha';
import { AppDataSource } from '../../config';
import { questionCreate } from './fixture';

chai.use(spies);
chai.should();
chai.use(chaiHttp);

describe('QUESTION CREATE API', () => {
  const insertUrl = '/api/v1/question/create';

  afterEach(() => {
    chai.spy.restore();
  });

  it('Should return 200 and insert Question in to the database', (done) => {
    chai.spy.on(Question, 'findOne', () => {
      return Promise.resolve(null);
    });

    chai.spy.on(AppDataSource, 'query', () => {
      return Promise.resolve([{ nextVal: 9 }]);
    });

    chai.spy.on(Question, 'create', () => {
      return Promise.resolve({});
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
      .post(insertUrl)
      .send(questionCreate.validInsertQuestion)
      .end((err: any, res: any) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('successful');
        done();
      });
  });

  it('Should return 500 and not insert record in the database', (done) => {
    chai.spy.on(AppDataSource, 'transaction', () => {
      return Promise.reject(new Error('error occurred while connecting to the database'));
    });

    chai
      .request(app)
      .post(insertUrl)
      .send(questionCreate.validInsertQuestion)
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('failed');
        done();
      });
  });

  it('Should return 400 and not insert record when request object contains missing fields', (done) => {
    chai
      .request(app)
      .post(insertUrl)
      .send(questionCreate.inValidSchemaQuestion)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('failed');
        res.body.responseCode.should.be.eq('CLIENT_ERROR');
        res.body.err.err.should.be.eq('QUESTION_INVALID_INPUT');
        done();
      });
  });

  it('Should return 400 and not insert record when given invalid schema', (done) => {
    chai
      .request(app)
      .post(insertUrl)
      .send(questionCreate.invalidInsertTypeQuestion)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('failed');
        res.body.responseCode.should.be.eq('CLIENT_ERROR');
        res.body.err.err.should.be.eq('QUESTION_INVALID_INPUT');
        done();
      });
  });
});
