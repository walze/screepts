import { filter, flatten, length, map, pipe } from 'ramda';

import { ReturnCode } from './consts';

export const iff = <T, A>(
  predicate: (t: T) => boolean,
  a: (t: T) => A,
) => (t: T): A | null => predicate(t) ? a(t) : (() => null)();

export const ifElse = <T, A, B>(
  predicate: (t: T) => boolean,
  a: (t: T) => A,
  b: (t: T) => B,
) => (t: T): A | B => predicate(t) ? a(t) : b(t);

export const flip = <T extends (...args: any) => any>(f: T) => (b: Parameters<ReturnType<T>>[0]) => (a: Parameters<T>[0]): ReturnType<ReturnType<T>> => f(a)(b);

export const assertThrow = <T>(t: T, message = '') => {
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

export const countHarvestable = pipe(
  ({ pos: { x, y }, room }: Source) => room.lookAtArea(y - 1, x - 1, y + 1, x + 1),
  Object.values,
  map(Object.values),
  flatten,
  filter<LookAtResult>(({ terrain }) => terrain === 'plain' || terrain === 'swamp'),
  length,
);

