"use strict";
require('dotenv/config');
function selectEnvironment() {
    this.environment;
    var environment_to_test = process.env.ENVIRONMENT_TO_TEST;
    if (environment_to_test === "UAT" || environment_to_test === "uat" || environment_to_test === "Uat") {

            this.environment = "uat-env-variables.environment.json";
                return this.environment;
    }
    else if (environment_to_test === "TEST" || environment_to_test === "test" || environment_to_test === "Test") {

            this.environment = "test-env-variables.environment.json";
                return this.environment;
    }
    else if (environment_to_test === "DEV" || environment_to_test === "dev" || environment_to_test === "Dev") {
        this.environment = "dev-env-variables.environment.json";
        return this.environment;
    }
    else if (environment_to_test === "PROD" || environment_to_test === "prod" || environment_to_test === "Prod") {
        this.environment = "prod-env-variables.environment.json";
        return this.environment;
    }
};
module.exports = new selectEnvironment();
