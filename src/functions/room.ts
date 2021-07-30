import { keys, map, pipe, tap } from 'ramda';
import { getCreeps, makeCreep } from './creep';
import { assertThrow, iff } from '../helpers';
import { ROLE, ROLES } from '../types';

const amountCreeps = {
  [ROLES.HAVESTER]: 2,
  [ROLES.BUILDER]: 1,
  [ROLES.UPGRADER]: 1,
};

// Refactor this
for (const key in Game.rooms) if (Object.prototype.hasOwnProperty.call(Game.rooms, key)) {
  const room = Game.rooms[key] as Room;
  const sources = room?.find(FIND_SOURCES);

  room.memory.sources = {};
  sources.map(s => room.memory.sources[s.id] = {
    creeps: {},
    total: 0,
    current: () => Object.keys(room.memory.sources[s.id]!).length,
  });
}

export const findSpawn = (room: Room) =>
  room.find(FIND_MY_SPAWNS, { filter: { spawning: null } })[0];

export const setRoomCreeps
= (cs: Creep[]) =>
  (room: Room) => pipe(
    getCreeps,
    Object.entries,
    map(([s, css]) => {
      room.memory[s as ROLE] = css.length;
    }),
    () => {},
  )(cs);

export const roomCreepSpawner
= (room: Room) =>
  pipe(
    () => keys(ROLES),
    tap(map(iff(
      role => (room.memory[role] || 0) < amountCreeps[role],
      makeCreep(assertThrow(findSpawn(room))),
    ))),
  )();

export const a = (r: Room) => pipe(
  () => r.find(FIND_SOURCES),
  map(s => s),
);
