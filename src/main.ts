import { keys } from 'ramda';
import { makeCreep, runCreep } from './functions/creep';
import { ROLES } from './types';

const amountCreeps = {
  [ROLES.HAVESTER]: 2,
  [ROLES.BUILDER]: 0,
  [ROLES.UPGRADER]: 0,
};

export const loop = () => {
  const { creeps: creepsObj, rooms: roomsObj } = Game;
  const creeps = Object.values(creepsObj);
  const rooms = Object.values(roomsObj);

  creeps.map(runCreep);

  rooms.map(room => {
    keys(ROLES).map(role => {
      room.memory[role] = creeps.filter(c => c.memory.role === role).length;

      if (room.memory[role] < amountCreeps[role])
        makeCreep(room.find(FIND_MY_SPAWNS)[0]!)(role);

      return 0;
    });

    return 0;
  });

  console.log('------------------------');
};

module.exports = { loop };
