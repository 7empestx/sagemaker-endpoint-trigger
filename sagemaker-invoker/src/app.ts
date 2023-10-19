import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { SageMakerRuntimeClient, InvokeEndpointCommand } from '@aws-sdk/client-sagemaker-runtime';

const sagemakerClient = new SageMakerRuntimeClient({ region: 'us-west-2' });

function isValidPayload(payload: string): boolean {
    return payload.trim().length > 0;
}

function handleError(error: any): APIGatewayProxyResult {
    console.error('Error:', error);
    let errorMessage = 'Error invoking SageMaker Endpoint';

    if (error instanceof Error) {
        errorMessage = error.message;
    }

    if (error.code === 'ValidationError') {
        errorMessage = 'Invalid input format';
    }

    return {
        statusCode: 500,
        body: JSON.stringify({ message: errorMessage }),
    };
}

async function invokeEndpoint(libsvmData: string): Promise<APIGatewayProxyResult> {
    const params = {
        EndpointName: 'endpoint-80b8c435d12d-2023-10-19T04-13-15-686175',
        Body: libsvmData,
        ContentType: 'text/libsvm',
    };

    const command = new InvokeEndpointCommand(params);

    try {
        const response = await sagemakerClient.send(command);
        const decodedResponse = String.fromCharCode(...response.Body!);
        const predictions = decodedResponse.split(',').map(parseFloat);

        console.log(response);
        return {
            statusCode: 200,
            body: JSON.stringify({ predictions }),
        };
    } catch (error) {
        return handleError(error);
    }
}

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Extract LIBSVM data from the incoming event body
    const libsvmData = event.body || '';

    if (!isValidPayload(libsvmData)) {
        console.error('Invalid payload:', libsvmData);
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid input format' }),
        };
    }

    return await invokeEndpoint(libsvmData);
};
