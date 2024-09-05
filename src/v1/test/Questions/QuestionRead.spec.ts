import chai from 'chai';
import chaiHttp from 'chai-http';
import spies from 'chai-spies';
import app from '../../../app';
import { Question } from '../../models/question';

chai.use(chaiHttp);
chai.use(spies);

describe('Read Question API', () => {
  const getUrl = '/api/v1/question/read';

  afterEach(() => {
    chai.spy.restore();
  });

  it('should return 200 and successfully retrieve the question details', (done) => {
    // Mocking the findOne method to return a valid question
    const mockQuestionData = {
      id: 2,
      identifier: '123e4567-e89b-12d3-a456-426614174000',
      quid: 'q0004',
      type: 'grid',
      operation: 'division',
      name: {
        en: 'This is question for Division',
        ka: 'ಇದು ವಿಭಜನೆಯ ಪ್ರಶ್ನೆಯಾಗಿದೆ',
        hi: 'यह प्रभाग के लिए प्रश्न है',
      },
      description: {
        en: 'This is description for the Question',
      },
      tenant: {
        id: 10,
        name: 'EkStep',
      },
      repository: {
        id: 1,
        name: 'AML',
      },
      qlevel: null,
      taxonomy: {
        l1: 'division',
        l2: '4D',
        l3: '4D by 2D without reminder',
        board: 'CBSE',
        class: 'Class-1',
      },
      gradient: 'g4',
      hints: {
        en: ['This is the hint for the question '],
      },
      solutions: {
        en: ['This is the solutions for the questions'],
      },
      status: 'draft',
      media: [
        {
          src: 'https://example.com/media/div.png',
          baseUrl: 'http://www.example.com/media',
          mimeType: 'image',
          mediaType: 'image/png',
        },
      ],
      body: {
        numbers: ['8012', '12'],
        prefill: ['BB', 'FBB'],
        showCarry: false,
        wrongAnswers: [{ '650,0': ['carry'] }, { '510,10': ['pvp'] }, { option: '650,0', subskill: ['x+0', 'carry'] }, { option: '510,10' }],
        wronganswer1: [
          { value: 0, option: '650, 0', subskill: ['carry'] },
          { value: 0, option: '510, 10', subskill: ['x+0'] },
        ],
        division_intermediate_steps_preFill: ['BB', 'BF', 'BB', 'BB'],
      },
      version: '1.0',
      is_active: true,
      created_at: '2024-09-04T08:48:47.751Z',
      updated_at: '2024-09-04T08:48:47.752Z',
    };

    // Mocking findOne to return mockQuestionData
    chai.spy.on(Question, 'findOne', () => {
      return Promise.resolve({ mockQuestionData });
    });

    // Performing GET request to fetch the question
    chai
      .request(app)
      .get(`${getUrl}/2`) // Assuming 2 is the question ID
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('successful');
        done();
      });
  });

  it('should return 409 and Requested tenant id  does not exist', (done) => {
    chai.spy.on(Question, 'findAll', () => {
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
      .get(`${getUrl}/1`)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('failed');
        res.body.responseCode.should.be.eq('INTERNAL_SERVER_ERROR');
        res.body.err.err.should.be.eq('QUESTION_READ_FAILURE');
        done();
      });
  });
});
