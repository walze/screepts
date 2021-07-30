import { ap } from 'ramda';
import { setMaxCreep2Source } from './boot/source';
import { runCreep } from './functions/creep';
import { a, roomCreepSpawner, setRoomCreeps } from './functions/room';

Memory.bootFns = () => {
  setMaxCreep2Source();
};

Memory.bootFns();

export const loop = () => {
  const { creeps: creepsObj, rooms: roomsObj } = Game;
  const creeps = Object.values(creepsObj);
  const rooms = Object.values(roomsObj);

  creeps.map(runCreep);

  ap([
    roomCreepSpawner,
    setRoomCreeps(creeps),
    a,
  ], rooms);

  console.log(
    '------------------------',

  );
};

module.exports = { loop };

// Harvest if
// current < total
