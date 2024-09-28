import app from '../../app';
import chai from 'chai';
import chaiHttp from 'chai-http';
import spies from 'chai-spies';
import { describe, it, afterEach } from 'mocha';
import { S3Client } from '@aws-sdk/client-s3';
import { Process } from '../../models/process';
import { processRequest } from './fixture';

chai.use(chaiHttp);
chai.use(spies);
chai.should();

describe('BULK UPLOAD API', () => {
  const uploadUrl = '/api/v1/bulk/upload/url';

  afterEach(() => {
    chai.spy.restore();
  });

  it('Should return a signed URL for uploading a question and insert meta data into process table', (done) => {
    process.env.bucketName = 'value';
    chai.spy.on(S3Client.prototype, 'send', () => {
      return Promise.resolve({ url: 'signed url', message: 'success', error: false });
    });

    chai.spy.on(Process, 'findOne', () => {
      return Promise.resolve(null);
    });

    chai.spy.on(Process, 'create', () => {
      return Promise.resolve({ dataValues: { id: 1, fileName: 'fib.zip', process_id: '19b20fd6-029b-477b-9f65-28029f7ce1d9' } });
    });

    chai
      .request(app)
      .post(uploadUrl)
      .send(processRequest.validRequest)
      .end((err, res) => {
        console.log('🚀 ~ .end ~ res:', res.body);
        if (err) return done(err);
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.responseCode.should.be.eq('OK');
        res.body.params.status.should.be.eq('SUCCESS');
        res.body.result.should.have.property('process_id');
        done();
      });
  });

  it('Should return an error for invalid request body', (done) => {
    chai
      .request(app)
      .post(uploadUrl)
      .send(processRequest.missingFields)
      .end((err, res) => {
        if (err) return done(err);

        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('code').eql('UPLOAD_INVALID_INPUT');

        done();
      });
  });

  it('Should return an error for invalid schema', (done) => {
    chai
      .request(app)
      .post(uploadUrl)
      .send(processRequest.invalidSchema)
      .end((err, res) => {
        if (err) return done(err);

        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('code').eql('UPLOAD_INVALID_INPUT');

        done();
      });
  });
});
