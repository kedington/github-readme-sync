/* eslint-disable no-param-reassign */
const core = require('@actions/core');
const request = require('request-promise-native');
const glob = require('glob');
const swaggerInline = require('swagger-inline');
const OAS = require('oas-normalize');
const promisify = require('util').promisify;

const globPromise = promisify(glob);

async function run() {
  let oasKey;

  try {
    oasKey = core.getInput('readme-oas-key', {required: true});
  } catch (e) {
    core.setFailed(
        'You need to set your key in secrets!\n\nIn the repo, go to Settings > Secrets and add README_OAS_KEY. You can get the value from your ReadMe account.'
    );
  }

  const readmeKey = oasKey.split(':')[0];
  const apiSettingId = oasKey.split(':')[1];

  const apiVersion = core.getInput('api-version');
  const apiFilePath = core.getInput('oas-file-path');
  const apiFileUrl = core.getInput('oas-file-url');
  console.log(apiFileUrl);

  if (apiFileUrl) {
      console.log('pog');
      const oas = new OAS(apiFileUrl);
      let baseFile = {"definitions":{"Enrich":{"properties":{"requests":{"items":{"$ref":"#/definitions/Person"},"type":"array"}}},"Person":{"properties":{"birth_date":{"description":"The persons birth date. Either the year, or a full birth date","type":"string"},"company":{"description":"A name, website, or social url of a company where the person has worked","type":"string"},"country":{"description":"A country in which the person lives","type":"string"},"data_include":{"description":"A comma-separated string of fields that you would like the response to include. eg. \"names.clean,emails.address\". Begin the string with a - if you would instead like to exclude the specified fields. If you would like to exclude all data from being returned, use data_include=\"\".","type":"string"},"email":{"description":"An email the person has used","type":"string"},"email_hash":{"description":"A sha256 email hash","type":"string"},"first_name":{"description":"The persons first name","type":"string"},"include_if_matched":{"default":false,"description":"If set to true, includes a top-level (alongside \"data\", \"status\", etc) field \"matched\" which includes a value for each queried field parameter that was \"matched-on\" during our internal query.","type":"boolean"},"last_name":{"description":"The persons last name","type":"string"},"lid":{"description":"A LinkedIn numerical ID","type":"string"},"locality":{"description":"A locality in which the person lives","type":"string"},"location":{"description":"A location in which a person lives","type":"string"},"middle_name":{"description":"The persons middle name","type":"string"},"min_likelihood":{"default":0,"description":"The minimum likelihood score a response must possess in order to return a 200","format":"int32","maximum":10,"minimum":0,"type":"integer"},"name":{"description":"The persons full name, at least first and last","type":"string"},"phone":{"description":"A phone number the person has used","type":"string"},"postal_code":{"description":"The postal code in which the person lives","type":"string"},"profile":{"description":"A social profile the person has used. https://docs.peopledatalabs.com/docs/social-networks","type":"string"},"region":{"description":"A state or region in which the person lives","type":"string"},"required":{"description":"Parameter specifying the fields and data points a response must have to return a 200","type":"string"},"school":{"description":"A name, website, or social url of a university or college the person has attended","type":"string"},"street_address":{"description":"A street address in which the person lives","type":"string"},"titlecase":{"default":false,"description":"Setting titlecase to true will titlecase the person data in 200 responses.","type":"boolean"}}}},"host":"api.peopledatalabs.com","info":{"description":"People data labs api","title":"api.peopledatalabs.com","version":"5.0"},"paths":{"/v5/person/bulk":{"post":{"consumes":["application/json"],"description":"Enrich up to 100 records","parameters":[{"description":"Api Key","in":"header","name":"X-Api-Key","required":true,"type":"string"},{"description":"The content type","enum":["application/json"],"in":"header","name":"Content-Type","required":true,"type":"string"},{"description":"Updated user object","in":"body","name":"body","required":true,"schema":{"$ref":"#/definitions/Enrich"}}],"produces":["application/json"],"responses":{"200":{"description":"Person Found"},"400":{"description":"Request contained either missing or invalid parameters"},"401":{"description":"Request contained a missing or invalid key"},"402":{"description":"Your account has reached the limit for free matches"},"403":{"description":"Your account has reached its quota for successful API calls"},"405":{"description":"Request method is not allowed on the requested resource"},"429":{"description":"An error occurred due to requests hitting the API too quick"}},"summary":"/bulk","tags":["person"]}},"/v5/person/enrich":{"get":{"consumes":["application/json"],"description":"Enrich a person record on a variety of fields","parameters":[{"description":"Api Key","in":"query","name":"api_key","required":true,"type":"string"},{"description":"The persons full name, at least first and last","in":"query","name":"name","required":false,"type":"string"},{"description":"The persons first name","in":"query","name":"first_name","required":false,"type":"string"},{"description":"The persons last name","in":"query","name":"last_name","required":false,"type":"string"},{"description":"The persons middle name","in":"query","name":"middle_name","required":false,"type":"string"},{"description":"A location in which a person lives","in":"query","name":"location","required":false,"type":"string"},{"description":"A street address in which the person lives","in":"query","name":"street_address","required":false,"type":"string"},{"description":"A locality in which the person lives","in":"query","name":"locality","required":false,"type":"string"},{"description":"A state or region in which the person lives","in":"query","name":"region","required":false,"type":"string"},{"description":"A country in which the person lives","in":"query","name":"country","required":false,"type":"string"},{"description":"The postal code in which the person lives","in":"query","name":"postal_code","required":false,"type":"string"},{"description":"A name, website, or social url of a company where the person has worked","in":"query","name":"company","required":false,"type":"string"},{"description":"A name, website, or social url of a university or college the person has attended","in":"query","name":"school","required":false,"type":"string"},{"description":"A phone number the person has used","in":"query","name":"phone","required":false,"type":"string"},{"description":"An email the person has used","in":"query","name":"email","required":false,"type":"string"},{"description":"A sha256 email hash","in":"query","name":"email_hash","required":false,"type":"string"},{"description":"A social profile the person has used. https://docs.peopledatalabs.com/docs/social-networks","in":"query","name":"profile","required":false,"type":"string"},{"description":"A LinkedIn numerical ID","in":"query","name":"lid","required":false,"type":"string"},{"description":"The persons birth date. Either the year, or a full birth date","in":"query","name":"birth_date","required":false,"type":"string"},{"default":0,"description":"The minimum likelihood score a response must possess in order to return a 200","format":"int32","in":"query","maximum":10,"minimum":0,"name":"min_likelihood","required":false,"type":"integer"},{"description":"Parameter specifying the fields and data points a response must have to return a 200","in":"query","name":"required","required":false,"type":"string"},{"default":false,"description":"Setting titlecase to true will titlecase the person data in 200 responses.","in":"query","name":"titlecase","required":false,"type":"boolean"},{"description":"A comma-separated string of fields that you would like the response to include. eg. \"names.clean,emails.address\". Begin the string with a - if you would instead like to exclude the specified fields. If you would like to exclude all data from being returned, use data_include=\"\".","in":"query","name":"data_include","required":false,"type":"string"},{"default":false,"description":"If set to true, includes a top-level (alongside \"data\", \"status\", etc) field \"matched\" which includes a value for each queried field parameter that was \"matched-on\" during our internal query.","in":"query","name":"include_if_matched","required":false,"type":"boolean"}],"produces":["application/json"],"responses":{"200":{"description":"Person Found"},"400":{"description":"Request contained either missing or invalid parameters"},"401":{"description":"Request contained a missing or invalid key"},"402":{"description":"Your account has reached the limit for free matches"},"403":{"description":"Your account has reached its quota for successful API calls"},"404":{"description":"No records were found matching your request"},"405":{"description":"Request method is not allowed on the requested resource"},"429":{"description":"An error occurred due to requests hitting the API too quick"}},"summary":"/enrich","tags":["person"]}},"/v5/person/search":{"get":{"consumes":["application/json"],"description":"Search People Data Labs Dataset","parameters":[{"description":"Api Key","in":"header","name":"X-Api-Key","required":true,"type":"string"},{"description":"The content type","enum":["application/json"],"in":"header","name":"Content-Type","required":true,"type":"string"},{"description":"An Elasticsearch (v7.7) query. See our underlying Elasticsearch mapping for reference.","in":"query","name":"query","type":"string"},{"description":"A SQL query of the format: SELECT * FROM person WHERE XXX, where XXX is a standard SQL boolean query involving PDL fields. Any use of column selections or the LIMIT keyword will be ignored.","in":"query","name":"sql","type":"string"},{"default":1,"description":"The number of matched records to return for this query if they exist*. Must be between 1 and 100","format":"int32","in":"query","maximum":100,"minimum":1,"name":"size","required":false,"type":"integer"},{"default":0,"description":"An offset value for pagination. Can be a number between 0 and 9999. Pagination can be executed up to a maximum of 10,000 records per query. Be sure to use the \"total\" response field to help discover how many total records exist in the dataset for your query","format":"int32","in":"query","maximum":9999,"minimum":0,"name":"from","required":false,"type":"integer"},{"default":false,"description":"Setting titlecase to true will will titlecase any records returned","in":"query","name":"titlecase","type":"boolean"},{"default":false,"description":"Whether the output should have human-readable indentation.","in":"query","name":"pretty","type":"boolean"}],"produces":["application/json"],"responses":{"200":{"description":"Person Found"},"400":{"description":"Request contained either missing or invalid parameters"},"401":{"description":"Request contained a missing or invalid key"},"402":{"description":"Your account has reached the limit for free matches"},"403":{"description":"Your account has reached its quota for successful API calls"},"405":{"description":"Request method is not allowed on the requested resource"},"429":{"description":"An error occurred due to requests hitting the API too quick"}},"summary":"/search","tags":["person"]}}},"schemes":["https","http"],"swagger":"2.0"}
      swaggerInline('**/*', {
        format: '.json',
        metadata: true,
        base: baseFile,
        ignoreErrors: true,
      })
        .then(generatedSwaggerString => {
           extracted(generatedSwaggerString)
        });
  } else {
      let baseFile = apiFilePath;

      if (!baseFile) {
        const files = await globPromise('**/{swagger,oas,openapi}.{json,yaml,yml}', {dot: true});
        baseFile = files[0];
        console.log(`Found spec file: ${baseFile}`);
        }
      swaggerInline('**/*', {
        format: '.json',
        metadata: true,
        base: baseFile,
        ignoreErrors: true,
      })
        .then(generatedSwaggerString => {
           extracted(generatedSwaggerString)
        });
  }

  function extracted(oasInput) {
    const oas = new OAS(oasInput);

    oas.bundle(function (err, schema) {
        if (!schema['x-si-base']) {
            // TODO: Put this back
            /*
          console.log("We couldn't find a Swagger file.".red);
          console.log(`Don't worry, it's easy to get started! Run ${'oas init'.yellow} to get started.`);
          process.exit(1);
          */
        }

        schema['x-github-repo'] = process.env.GITHUB_REPOSITORY;
        schema['x-github-sha'] = process.env.GITHUB_SHA;

        const options = {
            formData: {
                spec: {
                    value: JSON.stringify(schema),
                    options: {
                        filename: 'swagger.json',
                        contentType: 'application/json',
                    },
                },
            },
            headers: {
                'x-readme-version': apiVersion || schema.info.version, // apiVersion,
                'x-readme-source': 'github',
            },
            auth: {user: readmeKey},
            resolveWithFullResponse: true,
        };

        // TODO: Validate it here?

        return request.put(`https://dash.readme.io/api/v1/api-specification/${apiSettingId}`, options).then(
            () => {
                return 'Success!';
            },
            err => {
                if (err.statusCode === 503) {
                    core.setFailed(
                        'Uh oh! There was an unexpected error uploading your file. Contact support@readme.io with a copy of your file for help!'
                    );
                } else {
                    let errorOut = err.message;
                    try {
                        errorOut = JSON.parse(err.error).description;
                    } catch (e) {
                        // Should we do something here?
                    }
                    if (errorOut.match(/no version/i)) {
                        // TODO: This is brittle; I'll fix it in the API tomorrrow then come back here
                        errorOut +=
                            "\n\nBy default, we use the version in your OAS file, however this version isn't on ReadMe.\n\nTo override it, add `api-version: 'v1.0.0'` to your GitHub Action, or add this version in ReadMe!";
                    }

                    core.setFailed(errorOut);
                }
            }
        );
    });
  }
}

run();