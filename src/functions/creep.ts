
import {filter, reduce} from 'ramda';
import {movable} from '../helpers';
import {ROLE, ROLES} from '../types';
import {CreepTaskResult, doTask, taskBind} from './doTask';

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

const runHavester = (so: Parameters<Creep['harvest']>[0], storable: AnyCreep | AnyStoreStructure) => taskBind(
  doTask(
    'harvest',
    movable(c => c.harvest(so), so))(
    c => c.store.getFreeCapacity() > 0 ? OK : ERR_FULL,
  ),

  doTask(
    'transfer',
    movable(c => c.transfer(storable, RESOURCE_ENERGY), storable))(
    c => c.store.getUsedCapacity() > 0 || (storable.store.getFreeCapacity() || 0) > 0 ? OK : ERR_FULL),
);

const runBuilder = (storable: AnyStoreStructure, cst: Parameters<Creep['build']>[0]) => taskBind(
  doTask(
    'withdraw',
    movable(c => c.withdraw(storable, RESOURCE_ENERGY), storable))(
    c => cst && c.store.getUsedCapacity() < 1 && storable.store.energy >= 200 ? OK : ERR_FULL,
  ),

  doTask(
    'build',
    movable(c => c.build(cst), cst))(
    c => c.store.getUsedCapacity() > 0 ? OK : ERR_NOT_ENOUGH_ENERGY,
    _ => cst ? OK : ERR_INVALID_TARGET,
  ),
);

export const run: (r: Room) => (c: Creep) => (t: CreepTaskResult) => CreepTaskResult
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
