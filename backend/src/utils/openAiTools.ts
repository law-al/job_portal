import type { Tool } from 'openai/resources/responses/responses.mjs';

export const tools: Tool[] = [
  {
    type: 'function',
    strict: true,
    name: 'get_application_details',
    description: 'Retrieve detailed job application information by ID',
    parameters: {
      type: 'object',
      properties: {
        jobApplicationId: {
          type: 'string',
          description: 'The unique identifier for the job application',
        },
      },
      required: ['jobApplicationId'],
      additionalProperties: false,
    },
  },
];
