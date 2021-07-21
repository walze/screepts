import { mapObjIndexed } from 'ramda';
import { getCreeps, makeCreep, runCreep } from './functions/creep';
import { ROLES } from './types';

export const loop = () => {
  const { creeps, rooms } = Game;

  mapObjIndexed(c => c, creeps);

  mapObjIndexed(r => {
    const rCreeps = r.find(FIND_MY_CREEPS);
    const cps = getCreeps(rCreeps);
    const {
      HAVESTER = [],
      BUILDER = [],
      UPGRADER = [],
    } = cps;

    HAVESTER.map(runCreep(r));
    BUILDER.map(runCreep(r));
    UPGRADER.map(runCreep(r));

    if (HAVESTER.length < 3)
      r.find(FIND_MY_SPAWNS)
        .map(makeCreep(ROLES.HAVESTER));

    if (UPGRADER.length < 2)
      r.find(FIND_MY_SPAWNS)
        .map(makeCreep(ROLES.UPGRADER));

    if (BUILDER.length < 1)
      r.find(FIND_MY_SPAWNS)
        .map(makeCreep(ROLES.BUILDER));
  }, rooms);

  console.log('------------------------');
};

module.exports = { loop };
