import app from '../../../app';
import { MasterBoard } from '../../models/masterBoard';
import { MasterClass } from '../../models/masterClass';
import { skillMaster } from '../../models/skillMaster';
import { subSkillMaster } from '../../models/subSkillMaster';
import { roleMaster } from '../../models/roleMaster';
import chai from 'chai';
import chaiHttp from 'chai-http';
import spies from 'chai-spies';
import { describe, it } from 'mocha';

chai.use(spies);
chai.should();
chai.use(chaiHttp);

describe('Bulk Insert API', () => {
  const bulkInsertUrl = '/api/v1/bulk/create';

  // Restore spies after each test
  afterEach(() => {
    chai.spy.restore();
  });

  it('Should bulk insert entities into the database', (done) => {
    // Mocking findOne to simulate no entities found
    chai.spy.on(MasterBoard, 'findOne', () => Promise.resolve(null));
    chai.spy.on(MasterClass, 'findOne', () => Promise.resolve(null));
    chai.spy.on(skillMaster, 'findOne', () => Promise.resolve(null));
    chai.spy.on(subSkillMaster, 'findOne', () => Promise.resolve(null));
    chai.spy.on(roleMaster, 'findOne', () => Promise.resolve(null));

    // Mocking create to simulate entity creation
    chai.spy.on(MasterBoard, 'create', () => Promise.resolve({ id: 1, name: 'Board1' }));
    chai.spy.on(MasterClass, 'create', () => Promise.resolve({ id: 1, name: 'Class1' }));
    chai.spy.on(skillMaster, 'create', () => Promise.resolve({ id: 1, name: 'Skill1' }));
    chai.spy.on(subSkillMaster, 'create', () => Promise.resolve({ id: 1, name: 'SubSkill1' }));
    chai.spy.on(roleMaster, 'create', () => Promise.resolve({ id: 1, name: 'Role1' }));

    // Sending request to the API
    chai
      .request(app)
      .post(bulkInsertUrl)
      .send({
        id: 'api.bulk.create',
        ver: '1.0',
        ts: '2024-09-05T01:51:36Z',
        params: {
          msgid: 'test-msg-id',
        },
        request: {
          board: [
            {
              name: 'Board 1',
              description: 'Description for Board 1',
              status: 'live',
              board_id: '1',
              class_id: [1, 2, 3],
            },
          ],
          class: [
            {
              name: 'Class 1',
              prerequisites: 'Some prerequisites',
              description: 'Description for Class 1',
              tenant_id: 1,
            },
            {
              name: 'Class 2',
              prerequisites: 'Some prerequisites',
              description: 'Description for Class 2',
              tenant_id: 1,
            },
            {
              name: 'Class 3',
              prerequisites: 'Some prerequisites',
              description: 'Description for Class 3',
              tenant_id: 1,
            },
          ],
          skill: [
            {
              name: 'Skill 1',
              description: 'Description for Skill 1',
            },
          ],
          subskill: [
            {
              name: 'SubSkill 1',
              description: 'Description for SubSkill 1',
            },
          ],
          role: [
            {
              name: 'Role 1',
              description: 'Description for Role 1',
            },
            {
              name: 'Role 2',
              description: 'Description for Role 2',
            },
          ],
        },
      }) // Assuming validBulkInsert is defined
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('successful');
        done();
      });
  });

  // Test case: Insert fails due to database connection issues
  it('Should return an error when database connection fails', (done) => {
    // Mocking create to simulate a failure
    chai.spy.on(MasterBoard, 'create', () => {
      return Promise.reject(new Error('Database connection error'));
    });

    // Sending request to the API
    chai
      .request(app)
      .post(bulkInsertUrl)
      .send({ skill: [{ name: 'Skill1' }], subskill: [{ name: 'SubSkill1' }], role: [{ name: 'Role1' }] })
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.params.status.should.be.eq('failed');
        done();
      });
  });
});
