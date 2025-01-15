export const validateAiResponse = (output: any): boolean => {
  try {
    output = JSON.parse(output);
  } catch (e) {
    return false;
  }
  if (!Array.isArray(output)) {
    return false;
  }
  for (const item of output) {
    if (typeof item !== "string" || !item.startsWith("spotify:track:")) {
      return false;
    }
  }

  return true;
};
