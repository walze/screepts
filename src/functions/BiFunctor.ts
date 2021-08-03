import { pair } from 'ramda';

export const of: <F>(f: F) => <S>(s: S) => [F, S]
  = f => s => [f, s];

export const first: <A, B, C>(f: (a: A) => B) => (pac: [A, C]) => [B, C]
  = f => ([a, b]) => pair(f(a), b);

export const second: <A, B, C>(f: (a: B) => C) => (pac: [A, B]) => [A, C]
  = f => ([a, b]) => pair(a, f(b));

export const bimap: <A, B>(fab: (a: A) => B) => <C, D>(fcd: (a: C) => D) => (pac: [A, C]) => [B, D]
  = fab => fcd => ([a, b]) => pair(fab(a), fcd(b));

export const bimapf: <A, C>(pac: [A, C]) => <B>(fab: (a: A) => B) => <D>(fcd: (a: C) => D) => [B, D]
  = ([a, b]) => fab => fcd => pair(fab(a), fcd(b));
