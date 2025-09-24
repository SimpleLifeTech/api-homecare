export const DurationUtils = {
  daysToSeconds: (days: number) => days * 24 * 60 * 60,
  hoursToSeconds: (days: number) => days * 60 * 60,
  msToSeconds: (ms: number) => Math.ceil(ms / 1000),
  secondsToMs: (seconds: number) => seconds * 1000,
  minsToMs: (mins: number) => mins * 60_000,
};

const multiplies: Record<keyof Options, number> = {
  days: 24 * 60 * 60_000,
  hours: 60 * 60_000,
  minutes: 60_000,
  seconds: 1_000,
  milliseconds: 1,
};

type Options = { days?: number; minutes?: number; hours?: number; seconds?: number; milliseconds?: number };

const makeCallableResult = (time: number) => {
  return (strategy: 'ceil' | 'floor' | 'round' | 'exact' = 'round') => {
    if (strategy === 'exact') return time;
    return Math[strategy](time);
  };
};

export const Duration = (opts: Options) => {
  let time = 0;

  for (const keyTime of Object.keys(opts)) {
    time += opts[keyTime] * multiplies[keyTime];
  }

  return {
    toSeconds: makeCallableResult(time / multiplies.seconds),
    toMinutes: makeCallableResult(time / multiplies.minutes),
    toHours: makeCallableResult(time / multiplies.hours),
    toDays: makeCallableResult(time / multiplies.days),
    toMilliseconds: makeCallableResult(time / multiplies.milliseconds),
  };
};