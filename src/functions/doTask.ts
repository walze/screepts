
import {ROLE} from '../types';

export type Position = RoomPosition | { pos: RoomPosition }
export type CreepTask = (c: Creep) => Creep

export const doTask = <T extends Position>(doFn: (p: T, c: Creep) => ScreepsReturnCode) =>
	(role: ROLE) =>
		(position: T): CreepTask =>
			(creep: Creep): Creep => {
				const doCode = doFn(position, creep);
				const done = doCode === OK;
				const returnCode = done ? doCode
					: creep.moveTo(
						position,
						{visualizePathStyle: {stroke: '#ffffff'}},
					);

				creep.say(`${role} ${doCode}`);

				// Side-effects
				creep.memory.role = role;
				creep.memory.jobCode = returnCode;
				creep.memory.moving = !done;

				return creep;
			};
