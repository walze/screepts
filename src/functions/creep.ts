
import {filter, reduce} from 'ramda';
import {ROLE} from '../types';

export const makeCreep
	= (r: ROLE) =>
		(s: StructureSpawn) =>
			s.spawnCreep(
				[WORK, CARRY, MOVE],
				`${r}_${Date.now()}`,
				{memory: {role: r}},
			);

export const creepsByRole = (role: ROLE) =>
	filter((c: Creep) => c.memory.role === role);

type filteredCreeps = { [key in ROLE]: Creep[] }
export const getCreeps = reduce<Creep, filteredCreeps>(
	(object, creep: Creep) => ({
		...object,
		[creep.memory.role]: [...(object[creep.memory.role] || []), creep],
	}),
	{} as filteredCreeps,
);
