var newman = require('newman');
var expect = require('expect.js')
var selectEnv = require('../utils/environmentToTest');
var environment = selectEnv.environment;
var collection = 'collection/sampleService.collection.json';

describe('As a user, I want to test a sample microservice', function () {
    it('Running Aggregator tests', function (done) {
        this.timeout(600000);
        newman.run({
            collection: collection,
            timeout: 0,
            environment: 'envVariable/' + 'sample/' + 'sample-' + environment,
            reporters: ['html', 'cli', 'junit', 'json', 'allure'],
            reporter: {
                html: {
                    export: 'results/html/sampleService_Results.html'
                },
                junit: {
                    export: 'results/junit/sampleService_Results.xml'
                },
                json: {
                    export: 'results/json/sampleService_Results.json'
                },
                allure: {
                    export: 'results/allure/allure-results'
                }
            },
            color: true
        }, function (err, summary) {
            if(err) throw new Error(err)
            console.log("entered summary block ")
            var assertionFailures = summary.run.stats.assertions.failed;
            expect(assertionFailures).to.be(0);
            console.log("Test Executed");
            done();
        });
    });
});