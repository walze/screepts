import { filter, flatten, keys, length, map, pipe } from 'ramda';

export const isTrue = <T>(a: T) => Boolean(a) === true;

export const iff = <T, A>(
  predicate: (t: T) => boolean,
  a: (t: NonNullable<T>) => A,
) => (t: T): A | null => predicate(t) ? a(t as NonNullable<T>) : null;

export const ifElse = <T, A, B>(
  predicate: (t: T) => boolean,
  a: (t: NonNullable<T>) => A,
  b: (t: T) => B,
) => (t: T): A | B => predicate(t) ? a(t as NonNullable<T>) : b(t);

export const flip = <T extends (...args: any) => any>(f: T) => (b: Parameters<ReturnType<T>>[0]) => (a: Parameters<T>[0]): ReturnType<ReturnType<T>> => f(a)(b);

export const assertThrow = (message = '') => <T>(t: T) => {
  if (t) return t as NonNullable<T>;
  throw new Error(message);
};

export const ifCODE = (err: ReturnCode) => (r: ReturnCode) => r === err ? r : undefined;
export const ifOK = ifCODE(OK);
export const ifNotRange = ifCODE(ERR_NOT_IN_RANGE);

export const movable
  = (task: (c: Creep) => ReturnCode, ...moveP: Parameters<Creep['moveTo']>) =>
    (c: Creep) => {
      const code = task(c);

      return code === ERR_NOT_IN_RANGE ? c.moveTo(...moveP) : code;
    };

export const countObjectEntries = pipe(keys, length);
export const countObjectProps = pipe(Object.entries, countObjectEntries);

export const countHarvestable = pipe(
  ({ pos: { x, y }, room }: Source) => room.lookAtArea(y - 1, x - 1, y + 1, x + 1),
  Object.values,
  map(Object.values),
  flatten,
  filter<LookAtResult>(({ terrain }) => terrain === 'plain' || terrain === 'swamp'),
  length,
);

export const findLast = <T>(predicate: (value: T, index: number, obj: T[]) => boolean) => (array: T[]) => {
  let l = array.length;

  while (l--)
    if (predicate(array[l]!, l, array))
      return array[l];

  return null;
};

export const forEachValue = <A>(fn: (a: A[keyof A]) => unknown) => (a: A) => {
  for (const key in a)
    if (Object.prototype.hasOwnProperty.call(a, key))
      fn(a[key]);
};
