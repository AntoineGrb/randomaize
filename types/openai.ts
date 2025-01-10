export interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}
