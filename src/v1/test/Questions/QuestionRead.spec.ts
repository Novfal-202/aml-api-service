import chai from 'chai';
import chaiHttp from 'chai-http';
import spies from 'chai-spies';
import app from '../../../app';
import { Question } from '../../models/question'; // Assuming the model is named 'Question'

chai.use(chaiHttp);
chai.use(spies);

describe('Question read API', () => {
  const getUrl = '/api/v1/question/read';

  afterEach(() => {
    chai.spy.restore();
  });

  it('should return 200 and retrieve the question details', (done) => {
    const questionReadMockData = {
      id: '123456',
      name: 'question 1',
      description: 'This is Question 1, asking to add 3 apples and 2 apples horizontally.',
      sequence_num: 1,
      tenant_id: 5,
      tenant_board_id: 7,
      class_id: 2,
      repository_id: 8,
      l1_skill: 'Addition',
      l2_skill: '2D',
      l3_skill: 'You need to add 3 apples and 2 apples horizontally.',
      subskill: '0+X',
      answer: 'There are 5 apples in total, so the answer is 5.',
      type: 'worksheet',
      prerequisites: 'Understanding of numbers',
      benchmark_time: 4,
      status: 'active',
      hints: ['Start with Smaller Numbers', 'Group the Objects'],
      solutions: [
        { step: 1, description: 'Count the first group of 3 apples.' },
        { step: 2, description: 'Count the second group of 2 apples.' },
        { step: 3, description: 'Add the two groups together: 3 + 2 = 5.' },
      ],
      gradient: 'gx',
      rubrics: 'Correctly adding objects to get the total.',
      version: '1',
      media: {
        mime_type: 'image/png',
        src: 'apples_addition.png',
        base_url: 'https://example.com/media/',
      },
      isActive: true,
      createdBy: 'user123',
      createdAt: '2024-08-20T08:30:00.000Z',
      updatedBy: 'user123',
      updatedAt: '2024-08-20T08:30:00.000Z',
    };

    chai.spy.on(Question, 'findOne', () => {
      return Promise.resolve(questionReadMockData);
    });

    chai
      .request(app)
      .get(`${getUrl}/1`)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('successful');
        res.body.result.should.have.property('identifier').eq(1);
        done();
      });
  });

  it('should return 404 if the question is not found', (done) => {
    chai.spy.on(Question, 'findOne', () => {
      return Promise.resolve(null);
    });

    chai
      .request(app)
      .get(`${getUrl}/345`)
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

  it('should return 500 if there is a database connection error', (done) => {
    chai.spy.on(Question, 'findOne', () => {
      return Promise.reject(new Error('Database Connection Error'));
    });

    chai
      .request(app)
      .get(`${getUrl}/123456`)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('failed');
        res.body.responseCode.should.be.eq('INTERNAL_SERVER_ERROR');
        res.body.err.err.should.be.eq('QUESTION_READ_FAILURE');
        res.body.err.errmsg.should.be.eq('Database Connection Error');
        done();
      });
  });
});
