export const getAnchorId = (): string | null => {
  const id = window.location.hash;
  return id || null;
};
