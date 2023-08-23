export const delay = (delayInMs: number): Promise<any> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(null);
    }, delayInMs);
  });
};
