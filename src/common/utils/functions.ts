export const toBoolean = (value: any) => {
  if (["true", true].includes(value)) return true;
  if (["false", false].includes(value)) return false;
  return false;
};

export function isBoolean(value: any) {
  return ["false", false, "true", true].includes(value);
}
