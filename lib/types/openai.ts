/*
  Types returned by OpenAi API. 
*/

export interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}
