
import { filter, reduce } from 'ramda';
import { ReturnCode } from '../consts';
import { ROLE, ROLES } from '../types';
import { build, harvest, runTasks, transfer, withdraw, _runTasks } from './tasks';

export const makeCreep
  = (role: ROLE) =>
    (s: StructureSpawn) =>
      s.spawnCreep(
        [WORK, CARRY, MOVE, MOVE],
        `${role}_${Date.now()}__${Math.random()}`,
        { memory: {
          role,
          task: {
            code: OK,
            name: '',
            id: 0,
          },
        } },
      );

export const creepsByRole = (role: ROLE) => filter((c: Creep) => c.memory.role === role);

type filteredCreeps = { [key in ROLE]: Creep[] }
export const getCreeps = reduce<Creep, filteredCreeps>(
  (o, c) => ({
    ...o,
    [c.memory.role]: [...(o[c.memory.role] || []), c],
  }),
  {} as filteredCreeps,
);

export const runCreep: (r: Room) => (c: Creep) => ReturnCode
  = r => creep => {
    const sources = r.find(FIND_SOURCES);
    const spawns = r.find(FIND_MY_SPAWNS);
    const constructions = r.find(FIND_CONSTRUCTION_SITES);

    switch (creep.memory.role) {
    case ROLES.HAVESTER:
      return runTasks([
        harvest(sources[0]!),
        transfer(spawns[0]!),
      ])(creep);

    case ROLES.BUILDER:
      return _runTasks([
        withdraw(spawns[0]!, constructions[0]!),
        build(constructions[0]!),
        harvest(sources[0]!),
        transfer(spawns[0]!),
      ])(creep);

    default:
      throw new Error('unhandled role');
    }
  };
