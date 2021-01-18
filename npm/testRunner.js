#!/usr/bin/env node
//test
require('shelljs/global.js');
require('colors');
require('dotenv/config');


var Mocha = require('mocha')
    newman = require('newman'),
    expect = require('expect.js'),
    recursive = require('recursive-readdir');

    /**
     * The directory containing library test specs.
     *
     * @type {String}
     */
    SPEC_SOURCE_DIR = './test';
    module.exports = function (exit) {
        // banner line
        let mocha = new Mocha();
        var testsToRun = process.env.TEST_TO_RUN;
        recursive(SPEC_SOURCE_DIR, function (err, files) {
            if (err) {
                console.error(err);
                return exit(1);
            }

            files.filter(function (file) {
                var result = testsToRun.split(";");
                for(i=0; i<=files.length;i++){
                    if(file.includes(result[i])){
                        return file;
                    }
                }
            }).forEach(function (file) {
                console.log(file)
                mocha.addFile(file);
            });
            // start the mocha run
            global.expect = expect; // for easy reference
            global.newman = newman;

            mocha.run(function (err) {
                console.log("entered mocha")
                // clear references and overrides
                delete global.expect;
                delete global.newman;
                exit(err);
            });
            mocha = null; // cleanup
        });
    };

// ensure we run this script exports if this is a direct stdin.tty run
!module.parent && module.exports(exit);

