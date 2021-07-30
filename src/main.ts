import { keys, map, pair, pipe, tap } from 'ramda';
import { getCreeps, makeCreep, runCreep } from './functions/creep';
import { assertThrow, iff } from './helpers';
import { ROLE, ROLES } from './types';

const amountCreeps = {
  [ROLES.HAVESTER]: 2,
  [ROLES.BUILDER]: 1,
  [ROLES.UPGRADER]: 1,
};

const findSpawn = (room: Room) => room.find(FIND_MY_SPAWNS, { filter: { spawning: null } })[0];

const setRoomCreeps
= (cs: Creep[]) =>
  (room: Room) => pipe(
    getCreeps,
    Object.entries,
    map(([s, css]) => pair(s as ROLE, css.length)),
    map(([r, l]) => { room.memory[r] = l; }),
  )(cs);

const roomSpawner
  = (room: Room) =>
    pipe(
      () => keys(ROLES),
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

  rooms.map(roomSpawner);
  rooms.map(setRoomCreeps(creeps));

  console.log(
    '------------------------',
    rooms[0]!.find(FIND_MY_SPAWNS, { filter: { spawning: null } }),
  );
};

module.exports = { loop };
