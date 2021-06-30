import {identity} from 'ramda';
import * as _ from 'ts-toolbelt';

export const iff = <T, A extends (...any: any[]) => any, B extends (...any: any[]) => any>(
	predicate: (t: T) => boolean,
	a: A,
	b?: B,
) => (t: T): ReturnType<A | B> => predicate(t) ? a(t) : (b || identity)(t);

export const flip = <T extends (...args: any) => any>(f: T) => (b: Parameters<ReturnType<T>>[0]) => (a: Parameters<T>[0]): ReturnType<ReturnType<T>> => f(a)(b);
