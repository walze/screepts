import {identity} from 'ramda';
import * as _ from 'ts-toolbelt';

export const iff = <T, A extends (...any: any[]) => any, B extends (...any: any[]) => any>(
  predicate: (t: T) => boolean,
  a: A,
  b?: B,
) => (t: T): ReturnType<A | B> => predicate(t) ? a(t) : (b || identity)(t);

export const flip = <T extends (...args: any) => any>(f: T) => (b: Parameters<ReturnType<T>>[0]) => (a: Parameters<T>[0]): ReturnType<ReturnType<T>> => f(a)(b);

export const ifCODE = (err: ScreepsReturnCode) => (r: ScreepsReturnCode) => r === err ? r : undefined;
export const ifOK = ifCODE(OK);
export const ifNotRange = ifCODE(ERR_NOT_IN_RANGE);

export const movable
  = (task: (c: Creep) => ScreepsReturnCode, ...moveP: Parameters<Creep['moveTo']>) =>
    (c: Creep) => {
      const code = task(c);

      return code === ERR_NOT_IN_RANGE ? c.moveTo(...moveP) : code;
    };
