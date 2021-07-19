
import { filter, reduce } from 'ramda';
import { ERR_NO_TASK, ReturnCode } from '../consts';
import { CreepTask, ROLE, ROLES } from '../types';
import { build, harvest, transfer, withdraw } from './tasks';

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

export const creepsByRole = (role: ROLE) =>
  filter((c: Creep) => c.memory.role === role);

type filteredCreeps = { [key in ROLE]: Creep[] }
export const getCreeps = reduce<Creep, filteredCreeps>(
  (o, c) => ({
    ...o,
    [c.memory.role]: [...(o[c.memory.role] || []), c],
  }),
  {} as filteredCreeps,
);

export const runTasks: (ts: CreepTask[]) => (c: Creep) => ReturnCode
  = ts => c => {
    const { memory: { task: { id } } } = c;

    const ct = ts[id];
    c.memory.task.id = 0;

    if (!ct || ts.length < 1) return ERR_NO_TASK;

    const { code } = ct(c);
    if (code === OK) return code;

    return runTasks(
      ts.filter((_, _id) => _id !== id),
    )(c);
  };

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
        build(constructions[0]!),
        harvest(sources[0]!),
      ])(creep);

    default:
      throw new Error('unhandled role');
    }
  };
