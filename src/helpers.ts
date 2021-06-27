export const iff = <T, A extends (...any: any[]) => any, B extends (...any: any[]) => any>(
	predicate: (t: T) => boolean,
	a: A,
	b: B,
) => (t: T): ReturnType<A | B> => predicate(t) ? a(t) : b(t);
