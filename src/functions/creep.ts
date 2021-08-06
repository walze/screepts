
import { filter, flatten, reduce, repeat } from 'ramda';
import { countCreepsUsingSource, maxCreepsPerSource } from '../boot/source';
import { ERR_NEW_BORN, STORE_STRUCTURES } from '../consts';
import { ROLE, ROLES } from '../types';
import { runBuilder, runHarvester, runUpgrader } from './role';

export const roleBodyPartMap: { [key in ROLE]: BodyPartConstant[] } = {
  HAVESTER: [WORK, CARRY, MOVE, MOVE],
  BUILDER: [WORK, CARRY, MOVE, MOVE],
  UPGRADER: [WORK, CARRY, MOVE, MOVE],
  HEALER: [HEAL, HEAL, MOVE, MOVE],
  FIGHTER: [ATTACK, ATTACK, MOVE, MOVE],
  RANGER: [RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE],
};

export const makeCreep
  = (s: StructureSpawn) =>
    (role: ROLE, multiply = 1) => s.spawnCreep(
      flatten(repeat(roleBodyPartMap[role], multiply)),
      `${role}_${Date.now()}__${Math.random()}`,
      {
        memory: {
          role,
          task: {
            code: ERR_NEW_BORN,
            name: '',
            id: 0,
            repeating: false,
          },
        },
      },
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

export const runCreep: (c: Creep) => ReturnCode
  = creep => {
    if (creep.spawning) return ERR_NEW_BORN;

    const { room: { controller, ...room } } = creep;

    const sources = room.find(FIND_SOURCES);
    const source = sources.find(s => room.memory.sources[s.id]?.creeps[creep.id])
      || sources.find(s => countCreepsUsingSource(s) < maxCreepsPerSource(s));

    const [storable] = room.find(FIND_MY_STRUCTURES, {
      filter: s => STORE_STRUCTURES.some(ss => s.structureType === ss),
    }) as AnyStoreStructure[];

    const [construction] = room.find(FIND_CONSTRUCTION_SITES);

    switch (creep.memory.role) {
    case ROLES.HAVESTER:
      return runHarvester(
        source,
        storable,
      )(creep);

    case ROLES.BUILDER:
      return runBuilder(
        storable,
        construction,
        source,
      )(creep);

    case ROLES.UPGRADER:
      return runUpgrader(
        storable,
        construction,
        source,
        controller,
      )(creep);

    default:
      throw new Error('unhandled role');
    }
  };

