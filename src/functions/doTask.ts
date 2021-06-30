import {applyTo, lt} from 'ramda';

export type Position = RoomPosition | { pos: RoomPosition }
export type CreepTask = (c: Creep) => Creep

type KeysOfType<C, T> = {
  [K in keyof C]: C[K] extends T ? K : never
}[keyof C]

type K = KeysOfType<Creep, (...args: any) => any>
// Type TypeOfClassMethod<C, M extends keyof C> = C[M] extends (...args: any) => any ? C[M] : never;

export const doTask = <P extends K>(
	description: P,
	doFn: (c: Creep, ...p: Parameters<Creep[P]>) => ReturnType<Creep[P]>,
) =>
		(
			params: Parameters<Creep[P]>,
			...conditions: Array<([a, ...b]: [Creep, ...Parameters<Creep[P]>]) => ScreepsReturnCode>
		): CreepTask =>
			(creep: Creep): Creep => {
				const c = conditions
					.map(applyTo([creep, ...params]))
					.find(lt(0)) || OK;

				if (c !== OK) {
					creep.memory.jobCode = c;
					creep.say(`${description} ${c}`);

					return creep;
				}

				const doCode = doFn(creep, ...params);
				const done = doCode === OK;

				const p1 = params[0] as Extract<(typeof params[0]), { pos: number, x: number }>;
				const notDoneCode = p1?.pos || p1?.x
					? creep.moveTo(
              params[0] as Extract<(typeof params[0]), { x: number }>,
              (params[1] as MoveToOpts) || {},
					)
					: doCode;

				const returnCode = done ? doCode : notDoneCode;

				creep.say(`${description} ${doCode}`);

				// Side-effects
				creep.memory.jobCode = returnCode;
				creep.memory.moving = !done;

				return creep;
			};

