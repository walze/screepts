
import { filter, reduce } from 'ramda';
import { ERR_NO_TASK, ReturnCode } from '../consts';
import { ROLE, ROLES } from '../types';
import { build, harvest, transfer, withdraw, runTasks, upgradeController } from './tasks';

export const makeCreep
  = (s: StructureSpawn) =>
    (role: ROLE) =>
      s.spawnCreep(
        [WORK, CARRY, MOVE, MOVE],
        `${role}_${Date.now()}__${Math.random()}`,
        { memory: {
          role,
          task: {
            code: ERR_NO_TASK,
            name: '',
            id: 0,
            repeating: false,
          },
        } },
      );

export const creepsByRole = (role: ROLE) => filter((c: Creep) => c.memory.role === role);

export type CreepsByRole = { [key in ROLE]: Creep[] }
export const getCreeps = reduce<Creep, CreepsByRole>(
  (o, c) => ({
    ...o,
    [c.memory.role]: [...(o[c.memory.role] || []), c],
  }),
  {} as CreepsByRole,
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
      return runTasks([
        withdraw(spawns[0]!, constructions[0]!),
        harvest(sources[0]!),
        build(constructions[0]!),
        transfer(spawns[0]!),
      ])(creep);

    case ROLES.UPGRADER:
      return runTasks([
        withdraw(spawns[0]!, constructions[0]!),
        harvest(sources[0]!),
        upgradeController(r.controller),
        transfer(spawns[0]!),
      ])(creep);

    default:
      throw new Error('unhandled role');
    }
  };
