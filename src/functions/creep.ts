
import {filter, reduce} from 'ramda';
import {CreepTask, ROLE, ROLES, Tasks} from '../types';
import {build, harvest, transfer, withdraw} from './tasks';

export const makeCreep
  = (role: ROLE) =>
    (s: StructureSpawn) =>
      s.spawnCreep(
        [WORK, CARRY, MOVE, MOVE],
        `${role}_${Date.now()}__${Math.random()}`,
        {memory: {
          role,
          task: {
            code: OK,
            name: '',
            index: 0,
          },
        }},
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

const a: (...l: [name: Tasks, f: CreepTask][]) => (c: Creep) => ScreepsReturnCode
  = (...ts) => c => {
    const {memory: {task}} = c;
    const [, t0] = ts[task.index]!;

    const {code} = t0(c);

    if (code === OK) {
      c.memory.task.index = 0;

      return code;
    }

    const index = (task.index + 1) % ts.length;
    c.memory.task.index = index;

    return a(...ts)(c);
  };

export const runCreep: (r: Room) => (c: Creep) => ScreepsReturnCode
  = r => creep => {
    const sources = r.find(FIND_SOURCES);
    const spawns = r.find(FIND_MY_SPAWNS);
    const constructions = r.find(FIND_CONSTRUCTION_SITES);

    // If creep has task assigned,
    // do task
    // if no task is assigned
    // assign one from list order

    // if assigned task returns 0
    // repeat
    // if not 0
    // go to next task

    switch (creep.memory.role) {
    case ROLES.HAVESTER:
      return a(
        ['harvest', harvest(sources[0]!)],
        ['transfer', transfer(spawns[0]!)],
      )(creep);

    case ROLES.BUILDER:
      return a(
        ['withdraw', withdraw(spawns[0]!, constructions[0]!)],
        ['build', build(constructions[0]!)],
        ['harvest', harvest(sources[0]!)],
        ['transfer', transfer(spawns[0]!)],
      )(creep);

    default:
      throw new Error('unhandled role');
    }
  };
