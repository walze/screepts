import { keys, map, pipe, tap } from 'ramda';
import { makeCreep, runCreep } from './functions/creep';
import { assertThrow, iff } from './helpers';
import { ROLES } from './types';

const amountCreeps = {
  [ROLES.HAVESTER]: 2,
  [ROLES.BUILDER]: 1,
  [ROLES.UPGRADER]: 1,
};

const findSpawn = (room: Room) => room.find(FIND_MY_SPAWNS)[0];

const roomRunner
  = (cs: Creep[]) =>
    (room: Room) =>
      pipe(
        () => keys(ROLES),
        tap(map(role => {
          room.memory[role] = cs.filter(c => c.memory.role === role).length;
        })),
        tap(map(iff(
          role => (room.memory[role] || 0) < amountCreeps[role],
          makeCreep(assertThrow(findSpawn(room))),
        ))),
      )();

export const loop = () => {
  const { creeps: creepsObj, rooms: roomsObj } = Game;
  const creeps = Object.values(creepsObj);
  const rooms = Object.values(roomsObj);

  creeps.map(runCreep);

  rooms.map(roomRunner(creeps));

  console.log(
    '------------------------',
  );
};

module.exports = { loop };
