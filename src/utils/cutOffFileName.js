const cutOffFileName = (string, maxLength) =>
  string.slice(0, string.lastIndexOf('.')).length > maxLength
    ? `${string.slice(0, maxLength)}....${string.slice(
        string.lastIndexOf('.')
      )}`
    : string;

export default cutOffFileName;
