
import { filter, flatten, reduce, repeat } from 'ramda';
import { ERR_NEW_BORN } from '../consts';
import { CreepTaskResult, ROLE, ROLES, subRoles } from '../types';
import { taskBind } from './makeTask';
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
= (role: ROLE, multiply = 1) =>
  (s: StructureSpawn) =>
    s.spawnCreep(
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

const runRole = (r: ROLE) => ({
  [ROLES.HAVESTER]: (c: Creep) => runHarvester(c),
  [ROLES.BUILDER]: (c: Creep) => runBuilder(c),
  [ROLES.UPGRADER]: (c: Creep) => runUpgrader(c),

  [ROLES.FIGHTER]: (c: Creep) => runHarvester(c),
  [ROLES.RANGER]: (c: Creep) => runHarvester(c),
  [ROLES.HEALER]: (c: Creep) => runHarvester(c),
})[r];

export const runCreep: (c: Creep) => CreepTaskResult
  = creep => {
    if (creep.spawning) return {
      creep,
      code: ERR_NEW_BORN,
      name: creep.memory.task.name,
      error: ERR_NEW_BORN,
    };

    const runners = [
      runRole(creep.memory.role),
      ...subRoles[creep.memory.role].map(runRole),
    ];

    const r = taskBind(...runners)(creep);

    console.log(r.name, r.code, r.error);

    if (r.code !== OK) {
      creep.memory.task.code = 0;
      creep.memory.task.id = 0;
      creep.memory.task.name = '';
      creep.memory.task.repeating = false;
    }

    return r;
  };

