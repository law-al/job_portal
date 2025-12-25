import { OpenAI } from 'openai';
import config from '../config/config.js';

const openAi = new OpenAI({
  apiKey: config.OpenAiApiKey,
});

export default openAi;
