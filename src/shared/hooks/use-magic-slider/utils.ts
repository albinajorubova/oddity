type RemainingResult = {
  sRemain: number;
  tRemain: number;
};

/**
 * Вычисляет остаток пути и время до остановки для слайдера с постоянным замедлением
 * @param v - текущая скорость (px/s), положительная вправо, отрицательная влево
 * @param aMag - величина замедления (px/s^2), всегда положительная
 * @param sDone - уже пройденный путь (px), со знаком
 * @returns объект с остатком пути и временем до остановки
 */
export const computeRemainingAndTime = (
  v: number,
  aMag: number,
  sDone: number,
): RemainingResult => {
  if (v === 0 || aMag <= 0) return { sRemain: 0, tRemain: 0 };

  const a: number = -Math.sign(v) * aMag; // ускорение против скорости
  const sStop: number = (v * v) / (2 * aMag); // абсолютный тормозной путь
  const sStopSigned: number = Math.sign(v) * sStop; // путь с учётом направления

  const sRemain: number = sStopSigned - sDone; // остаток пути
  const tRemain: number = -v / a; // время до остановки, всегда положительное

  return { sRemain, tRemain };
};

export const findMinDistanceByValues = (
  array: number[],
  curValue: number,
  nextValue: number,
) => {
  let minDistance = Infinity;
  let minOriginalDist = Infinity;
  const curIndices: number[] = [];
  const nextIndices: number[] = [];

  // Сначала найдём индексы всех вхождений curValue и nextValue
  array.forEach((val, index) => {
    if (val === curValue) curIndices.push(index);
    if (val === nextValue) nextIndices.push(index);
  });

  // Сравниваем все пары и ищем минимальное расстояние
  for (const i of curIndices) {
    for (const j of nextIndices) {
      const originalDist = i - j;
      const distance = Math.abs(originalDist);
      if (distance < minDistance) {
        minDistance = distance;
        minOriginalDist = originalDist;
      }
    }
  }

  return Number.isFinite(minOriginalDist) ? minOriginalDist : -1; // -1 если пара не найдена
};
