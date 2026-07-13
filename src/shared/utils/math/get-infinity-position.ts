export const getInfinityPosition = (
  elPosition: number,
  whole: number,
  offset: number,
): number => {
  if (whole === offset) {
    return elPosition;
  }

  return (((elPosition % whole) + whole + offset) % whole) - offset;
};
