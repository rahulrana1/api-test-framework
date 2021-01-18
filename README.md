# acuit-api-integration-testing
This is the automation framework to run the API tests.
## Tools used to develop the framework:
1. Postman
2. Newman
3. Mocha

## Steps to integrate to CI(cloudbuild etc)
The framework creates a docker image to make the integration easy to CI.

Run the following command to build the image

1. Build a docker image for tests.
    - `./go build_integrationtest_docker_image`

2. Trigger your tests with below command. This accepts two paramters, first is for environment(DEV, TEST or UAT) and second is for name of the test.
    - Sample : `./go execute_integrationtests_docker UAT sample`

## Important point to consider:
- The framework provides the capability to run tests inside a particular folder with in a collection. This would be required if you want to run a particular test scenario.
-	It is recommended to run the tests at collection level.

## Branching
The default branch is develop, so branch off that with a branch for your feature etc, and raise a Pull Request on GitHub back into develop.

## Steps to run the tests from Continuous Integration:
1. npm install
2. npm test

## Next steps:
- Add more test scenarios for testing integration across other components in the stack.
- Integration with codeship.
- Publishing the test results to slack automatically after the execution is completed.


## Best practises:
-	Each folder inside a collection represents a single scenario. Always keep the tests inside folder independent of any other tests inside other folders in the collection.
- The above point would remove the dependencies between the tests and then multiple tests could be run in parallel to reduce the execution time.
- Avoid adding more than one scenario into a single folder inside the collection.

Note: This is work in progress and is initial version of the framework
