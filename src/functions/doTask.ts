
export type Position = RoomPosition | { pos: RoomPosition }
export type CreepTask = (c: Creep) => Creep

export const doTask = <P extends Position>(
	doFn: (p: P, c: Creep) => ScreepsReturnCode,
	description: string,
) =>
		(position: P): CreepTask =>
			(creep: Creep): Creep => {
				const doCode = doFn(position, creep);
				const done = doCode === OK;
				const returnCode = done ? doCode : moveTo(position, creep);

				creep.say(`${description} ${doCode}`);

				// Side-effects
				creep.memory.jobCode = returnCode;
				creep.memory.moving = !done;

				return creep;
			};

function moveTo(p: Position, c: Creep) {
	return c.moveTo(
		p,
		{visualizePathStyle: {stroke: '#ffffff'}},
	);
}

