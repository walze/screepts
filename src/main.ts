import { map, mapObjIndexed } from 'ramda';
import { getCreeps, makeCreep, runCreep } from './functions/creep';
import { ROLES } from './types';

export const loop = () => {
  const { creeps, rooms } = Game;

  mapObjIndexed(c => c, creeps);

  mapObjIndexed(r => {
    const rCreeps = r.find(FIND_MY_CREEPS);
    const cps = getCreeps(rCreeps);
    const { HAVESTER = [], BUILDER = [] } = cps;

    HAVESTER.map(runCreep(r));
    BUILDER.map(runCreep(r));

    if (HAVESTER?.length < 0)
      r.find(FIND_MY_SPAWNS)
        .map(makeCreep(ROLES.HAVESTER));

    if (BUILDER?.length < 1)
      r.find(FIND_MY_SPAWNS)
        .map(makeCreep(ROLES.BUILDER));
  }, rooms);

  console.log('------------------------');
};

module.exports = { loop };
