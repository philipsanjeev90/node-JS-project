process.env.NODE_ENV = 'test';


import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server';

let should = chai.should();

chai.use(chaiHttp);

describe('Test for Weather  API failed response 404', () => {

    it('it should get weather Data object', (done) => {
        chai.request(server)
            .get('/weather/abc678yg')
            .end((err, res) => {
                res.body.should.have.property('code').eql("404")
                res.body.should.have.property('code');
                res.body.should.have.property('message');
                res.body.should.have.property('description').eql('error occoured on server, please try again after some time');
                done();
            });
    });

    it('it should get weather Data object', (done) => {
        chai.request(server)
            .get('/weather/abc678yg/34rfefvd')
            .end((err, res) => {
                res.body.should.have.property('code').eql("404")
                res.body.should.have.property('code');
                res.body.should.have.property('message');
                res.body.should.have.property('description').eql('error occoured on server, please try again after some time');
                done();
            });
    });


});
