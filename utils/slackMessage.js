const fs = require('fs');
const glob = require("glob");
//const json = require('../results/json')

function createSlackResults() {

    try {
        glob("results/json/*.json", function (err, files) {
            if (err) {
                console.log("cannot read the folder, something goes wrong with glob", err);
            }
            files.forEach(function (file) {
                fs.readFile(file, 'utf8', function (err, data) {

                    if (err) {
                        console.log("cannot read the file, something goes wrong with the file", err);
                    }

                    let resultData = JSON.parse(data)
                    let objFilteredData = getStatsFromResultsJson(resultData)
                    let strSlackResults = getResultsTxtFormat(objFilteredData)
                    writeLoadTestResultsToTxtFile(strSlackResults)
                })
            })
        })
    }
    catch (err) {
        console.log(err)
    }
}

function getStatsFromResultsJson(jsonResults) {
    return objResults = {
        testName: jsonResults.collection.info.name,
        totalRequests: jsonResults.run.stats.requests.total,
        totalTests: jsonResults.run.stats.tests.total,
        failedAssertions: `${jsonResults.run.stats.assertions.failed} / ${jsonResults.run.stats.assertions.total}`
    }
}

async function writeLoadTestResultsToTxtFile(strSlackResults) {
    const resultsFilePath = './results/resultsForSlack.txt'

    fs.appendFile(resultsFilePath, strSlackResults, (error) => {
        if (error) throw error;
    });
}

function getResultsTxtFormat(results) {

    let strResults = `*${results.testName}* : \n Total Requests : ${results.totalRequests} \n Failed Assertions : ${results.failedAssertions} \n\n`
    return strResults
}

createSlackResults()