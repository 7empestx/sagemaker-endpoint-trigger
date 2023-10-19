import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { SageMakerRuntimeClient, InvokeEndpointCommand } from '@aws-sdk/client-sagemaker-runtime';

const sagemakerClient = new SageMakerRuntimeClient({ region: 'us-west-2' });

const data =
    '0 ' +
    Array(51)
        .fill(0)
        .map((v, i) => `${i + 1}:${v}`)
        .join(' ');

async function invokeEndpoint(): Promise<APIGatewayProxyResult> {
    const params = {
        EndpointName: 'endpoint-9fbb3b825b31-2023-10-18T18-45-58-847556',
        Body: data,
        ContentType: 'text/libsvm', // Change the content type
    };

    const command = new InvokeEndpointCommand(params);

    try {
        const response = await sagemakerClient.send(command);
        console.log(response);
        return {
            statusCode: 200,
            body: JSON.stringify(response),
        };
    } catch (error) {
        console.error('Error invoking SageMaker Endpoint:', error);

        let errorMessage = 'Error invoking SageMaker Endpoint';
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return {
            statusCode: 500,
            body: JSON.stringify({ message: errorMessage }),
        };
    }
}

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    return await invokeEndpoint();
};
