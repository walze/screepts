
import {filter, reduce} from 'ramda';
import {ROLE, ROLES} from '../types';
import {CreepTaskResult, taskBind} from './doTask';
import {runBuilder, runHavester} from './roles';

export const makeCreep
  = (r: ROLE) =>
    (s: StructureSpawn) =>
      s.spawnCreep(
        [WORK, CARRY, MOVE, MOVE],
        `${r}_${Date.now()}__${Math.random()}`,
        {memory: {
          role: r,
          taskCode: 0,
          task: 'idle',
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

export const runCreep: (r: Room) => (c: Creep) => (t: CreepTaskResult) => CreepTaskResult
  = r => c => {
    const sources = (r.find(FIND_SOURCES));
    const spawns = (r.find(FIND_MY_SPAWNS));
    const constructions = (r.find(FIND_CONSTRUCTION_SITES));

    switch (c.memory.role) {
    case ROLES.HAVESTER:
      return runHavester(sources[0]!, spawns[0]!);

    case ROLES.BUILDER:
      return taskBind(
        runBuilder(spawns[0]!, constructions[0]!),
        runHavester(sources[0]!, spawns[0]!),
      );

    default:
      throw new Error('unhandled role');
    }
  };
