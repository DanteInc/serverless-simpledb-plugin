'use strict';

/**
 * Serverless SimpleDB Plugin
 * 
 * Allows use of variables with cloudformation resource names as needed for SimpleDB.
 * 
 * http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-simpledb.html
 * 
 * https://github.com/serverless/serverless/issues/974
 */

const _ = require('lodash');
const debug = require('debug')('simpledb');

module.exports = function (S) {

    let originalMethod = S.utils.populate;
    
    S.utils.populate = function () {

        let stage = arguments[3];
        let region = arguments[4];
        let variablesObject = S.getProject().getVariablesObject(stage, region);

        let varTemplateSyntax = /\${([\s\S]+?)}/g;

        let replace = function (result, value, key) {
            if (key.match(varTemplateSyntax)) {

                key.match(varTemplateSyntax).forEach((variableSyntax) => {

                    let variableName = variableSyntax.replace(varTemplateSyntax, (match, varName) => varName.trim());

                    if (variableName in variablesObject) {
                        let variableValue = variablesObject[variableName];
                        key = replaceall(variableSyntax, variableValue, key);
                    }
                });

                key = key.replace('-', '');
                debug("Replaced KEY: %s", key);
            }

            result[key] = value;
        };

        // https://github.com/leecrossley/replaceall/blob/master/replaceall.js
        let replaceall = function (replaceThis, withThis, inThis) {
            withThis = withThis.replace(/\$/g, "$$$$");
            return inThis.replace(new RegExp(replaceThis.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|<>\-\&])/g, "\\$&"), "g"), withThis);
        };

        arguments[2].Resources = _.transform(arguments[2].Resources, replace, {});
        arguments[2].Outputs = _.transform(arguments[2].Outputs, replace, {});

        let result = originalMethod.apply(this, arguments);
        
        // console.log("result2: %s", JSON.stringify(result, null, 2));
        return result;
    }
};