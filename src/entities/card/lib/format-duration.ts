export const formatDurationSeconds = (
  seconds: number | null | undefined,
): string | null => {
  if (seconds == null || seconds <= 0) return null;

  const minutes = Math.floor(seconds / 60);
  const restSeconds = seconds % 60;

  if (minutes === 0) return `${restSeconds}s`;
  if (restSeconds === 0) return `${minutes}m`;

  return `${minutes}m ${restSeconds}s`;
};

export const sumTracklistDuration = (
  tracks: Array<{ duration: string | null }> | null | undefined,
): string | null => {
  if (!tracks?.length) return null;

  let totalSeconds = 0;
  let parsedAny = false;

  for (const track of tracks) {
    const value = track.duration?.trim();
    if (!value) continue;

    const match = value.match(/^(\d+):(\d{2})$/);
    if (!match) continue;

    totalSeconds += Number(match[1]) * 60 + Number(match[2]);
    parsedAny = true;
  }

  return parsedAny ? formatDurationSeconds(totalSeconds) : null;
};
