export const getChangedFields = (
  values?: Record<string, unknown>,
  initialValues?: Record<string, unknown>,
) => {
  if (!values || !initialValues) return [];

  return Object.keys(values).filter((key) => {
    const current = values[key];
    const initial = initialValues[key];

    if (current === initial) return false;

    return JSON.stringify(current) !== JSON.stringify(initial);
  });
};
