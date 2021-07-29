import { filter, flatten, keys, length, map, pipe, tap, values } from 'ramda';
import { makeCreep, runCreep } from './functions/creep';
import { iff } from './helpers';
import { ROLES } from './types';

const amountCreeps = {
  [ROLES.HAVESTER]: 2,
  [ROLES.BUILDER]: 1,
  [ROLES.UPGRADER]: 0,
};

const findSpawn = (room: Room) => room.find(FIND_MY_SPAWNS, { filter: { spawning: false } })?.[0];

const roomRunner = (cs: Creep[]) => (room: Room) => {
  pipe(
    () => keys(ROLES),
    tap(map(role => { room.memory[role] = cs.filter(c => c.memory.role === role).length; })),
    tap(map(iff(
      role => room.memory[role] < amountCreeps[role],
      makeCreep(findSpawn(room)!),
    ))),
  )();

  return room;
};

const countHarvestable = pipe(
  ({ pos: { x, y }, room }: Source) => room.lookAtArea(y - 1, x - 1, y + 1, x + 1),
  o => Object.values(o),
  map(Object.values),
  flatten,
  filter<LookAtResult>(({ terrain }) => terrain === 'plain' || terrain === 'swamp'),
  length,
);

export const loop = () => {
  const { creeps: creepsObj, rooms: roomsObj } = Game;
  const creeps = Object.values(creepsObj);
  const rooms = Object.values(roomsObj);

  creeps.map(runCreep);

  // Rooms.map(roomRunner(creeps));

  const room = rooms[0]!;
  const source = room.find(FIND_SOURCES)[0]!;

  console.log(
    '------------------------',
    countHarvestable(source),
  );
};

module.exports = { loop };
