/**
 * Returns a random sample of elements from an array
 * @param array
 * @param sampleSize
 * @returns A array of random elements
 */
export const getRandomSample = <T>(array: T[], sampleSize: number): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
  }
  return shuffled.slice(0, sampleSize); // Return the first sampleSize elements
};
