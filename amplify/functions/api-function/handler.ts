import type { APIGatewayProxyHandler } from "aws-lambda";

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log("event", event);
  
  const method = event.httpMethod;
  const path = event.path;
  
  // Simple in-memory storage for testing (use DynamoDB in production)
  let response;
  
  switch (method) {
    case 'GET':
      response = [
        { id: '1', content: 'Sample todo 1' },
        { id: '2', content: 'Sample todo 2' }
      ];
      break;
    case 'POST':
      const body = JSON.parse(event.body || '{}');
      response = { 
        id: Date.now().toString(), 
        content: body.content || 'New todo' 
      };
      break;
    case 'DELETE':
      response = { message: 'Todo deleted' };
      break;
    default:
      response = { message: 'Method not supported' };
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
    },
    body: JSON.stringify(response),
  };
};