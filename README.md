# sagemaker-endpoint-trigger

This serverless application is designed to invoke a SageMaker endpoint. Here's what you need to know:

## Directory Structure:

- dist/: Contains the compiled JavaScript files.
- src/: Contains the TypeScript source code.
- tests/: Contains the unit tests for the application.
- package.json: Node.js project descriptor file.
- tsconfig.json: TypeScript configuration file.

## Local Development and Testing:

### Building the Application:

Use the command:
`sam build`

Testing Functions Locally:

To invoke a function with a sample event:
`sam local invoke --event tests/unit/sample-event.json`

To start the API on your local machine:
`sam local start-api`

To access the local API:
`curl http://localhost:3000/`

## Unit Testing:

Navigate to the main directory:
`cd sagemaker-endpoint-trigger`

Install necessary dependencies:
`npm install`

Execute tests:
`npm run test`

## Cleanup:

To remove the deployed application:
`sam delete --stack-name sagemaker-endpoint-trigger`
