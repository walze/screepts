
import { filter, flatten, reduce, repeat } from 'ramda';
import { ERR_NEW_BORN } from '../consts';
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

    switch (creep.memory.role) {
    case ROLES.HAVESTER:
      return runHarvester(creep);

    case ROLES.BUILDER:
      return runBuilder(creep);

    case ROLES.UPGRADER:
      return runUpgrader(creep);

    default:
      throw new Error('unhandled role');
    }
  };

