
import {filter, pipe, pipeWith, reduce} from 'ramda';
import {iff} from '../helpers';
import {ROLE, ROLES} from '../types';
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

const harvestTask = doTask('harvest',	(c, ...s) => c.harvest(...s));
const transferTask = doTask('transfer',	(c, ...s) => c.transfer(...s));
const buildTask = doTask('build',	(c, ...s) => c.build(...s));
const withdrawTask = doTask('withdraw',	(c, ...s) => c.withdraw(...s));

const runHavester = (so: Parameters<Creep['harvest']>[0], store: Parameters<Creep['transfer']>[0]): CreepTask => taskPipe([
	harvestTask([so], c => c.store.getFreeCapacity() > 0 ? OK : ERR_NOT_ENOUGH_ENERGY),
	transferTask([store, RESOURCE_ENERGY]),
]);

const taskPipe = pipeWith((f: CreepTask, c: Creep) => c.memory.jobCode === OK ? c : f(c));

const runBuilder = (sp: StructureSpawn, cs: Parameters<Creep['build']>[0]) => taskPipe([
	withdrawTask(
		[sp, RESOURCE_ENERGY],
		([c, s]) => cs && c.store.getUsedCapacity() < 1 && s?.store?.energy >= 50 ? OK : ERR_FULL,
	),
	buildTask([cs], ([c]) => c.store.getUsedCapacity() > 0 ? OK : ERR_NOT_ENOUGH_ENERGY),
]);

const runUpgrader = (store: Parameters<Creep['transfer']>[0], so: Parameters<Creep['harvest']>[0]): CreepTask => taskPipe([
	harvestTask([so], c => c.store.getFreeCapacity() > 0 ? OK : ERR_NOT_ENOUGH_ENERGY),
	transferTask([store, RESOURCE_ENERGY]),
]);

const runners = {
	HAVESTER: runHavester,
	BUILDER: runBuilder,
	UPGRADER: runUpgrader,
};

export const run: (r: Room) => CreepTask
	= r => c => {
		const {role} = c.memory;

		const sources = (r.find(FIND_SOURCES));
		const spawns = (r.find(FIND_MY_SPAWNS));
		const constructions = (r.find(FIND_CONSTRUCTION_SITES));

		console.log(constructions[0]!);

		switch (role) {
			case ROLES.HAVESTER:
				return runners[role](sources[0]!, spawns[0]!)(c);

			case ROLES.BUILDER:
				return taskPipe([
					runners[role](spawns[0]!, constructions[0]!),
					runners[ROLES.HAVESTER](sources[0]!, spawns[0]!),
				])(c);

			default:
				throw new Error('unhandled role');
		}
	};
