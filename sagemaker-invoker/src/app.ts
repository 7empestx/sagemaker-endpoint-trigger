import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { SageMakerRuntimeClient, InvokeEndpointCommand } from '@aws-sdk/client-sagemaker-runtime';

const sagemakerClient = new SageMakerRuntimeClient({ region: 'us-west-2' });

async function invokeEndpoint(libsvmData: string): Promise<APIGatewayProxyResult> {
    const params = {
        EndpointName: 'endpoint-80b8c435d12d-2023-10-19T04-13-15-686175',
        Body: libsvmData,
        ContentType: 'text/libsvm',
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
    // Extract LIBSVM data from the incoming event body
    const libsvmData = event.body || '';

    return await invokeEndpoint(libsvmData);
};
