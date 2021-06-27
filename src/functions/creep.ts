
import {filter, pipe, reduce} from 'ramda';
import {iff} from '../helpers';
import {ROLE} from '../types';
import {CreepTask, doTask} from './doTask';

export const makeCreep
	= (r: ROLE) =>
		(s: StructureSpawn) =>
			s.spawnCreep(
				[WORK, CARRY, MOVE],
				`${r}_${Date.now()}`,
				{memory: {
					role: r,
					jobCode: 0,
					moving: false,
				}},
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

const harvestSource = doTask((s: Source, c) => c.harvest(s))('HAVESTER');
const transferSource = doTask((s: Parameters<Creep['transfer']>[0], c) => c.transfer(s, RESOURCE_ENERGY))('HAVESTER');

export const run = (r: Room): CreepTask => pipe(
	iff(
		(c: Creep) => c.store.getFreeCapacity() < 1,
		harvestSource(r.find(FIND_SOURCES)[0]!),
		transferSource(r.find(FIND_MY_SPAWNS)[0]!),
	),
);
