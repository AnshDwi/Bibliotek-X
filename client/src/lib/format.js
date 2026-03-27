export const titleCase = (value) =>
  value.replace(/(^\w|\s\w)/g, (match) => match.toUpperCase());

