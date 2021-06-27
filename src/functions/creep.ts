
import {filter, pipe, pipeWith, reduce} from 'ramda';
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

const harvestTask = doTask(
	(s: Parameters<Creep['harvest']>[0], c) => c.harvest(s),
	'harvest',
);

const transferTask = doTask(
	(s: Parameters<Creep['transfer']>[0], c) => c.transfer(s, RESOURCE_ENERGY),
	'transfer',
);

const buildTask = doTask(
	(s: Parameters<Creep['build']>[0], c) => c.build(s),
	'build',
);

const withdrawTask = doTask(
	(s: Parameters<Creep['withdraw']>[0], c) => c.withdraw(s, RESOURCE_ENERGY),
	'withdraw',
);

const runHavester = (r: Room): CreepTask => pipe(
	iff(
		(c: Creep) => c.store.getFreeCapacity() > 0,
		harvestTask(r.find(FIND_SOURCES)[0]!),
		transferTask(r.find(FIND_MY_SPAWNS)[0]!),
	),
);

const niceP = pipeWith((f: CreepTask, res: Creep) => {
	console.log(f, res);

	return res.memory.jobCode === OK ? res : f(res);
});
const runBuilder = (r: Room): CreepTask => niceP([
	withdrawTask(r.find(FIND_MY_SPAWNS)[0]!),
	buildTask(r.find(FIND_CONSTRUCTION_SITES)[0]!),
	runHavester(r),
]);

const runUpgrader = (r: Room): CreepTask => pipe(
	iff(
		(c: Creep) => c.store.getFreeCapacity() > 0,
		harvestTask(r.find(FIND_SOURCES)[0]!),
		transferTask(r.find(FIND_MY_SPAWNS)[0]!),
	),
);

const mappings: {[key in ROLE]: (r: Room) => CreepTask} = {
	HAVESTER: runHavester,
	BUILDER: runBuilder,
	UPGRADER: runUpgrader,
};

export const run: (r: Room) => CreepTask
  = r => c => mappings[c.memory.role](r)(c);
