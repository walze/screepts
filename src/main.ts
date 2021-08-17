
import { ap } from 'ramda';
import { ErrorMapper } from 'utils/ErrorMapper';
import { setMaxCreepPerSource } from './boot/source';
import { runCreep } from './functions/creep';
import { roomCreepSpawner, setRoomCreeps } from './functions/room';

Memory.bootFns = () => {
  setMaxCreepPerSource();
};

Memory.bootFns();

export const loop = ErrorMapper.wrapLoop(() => {
  const { creeps: creepsObj, rooms: roomsObj } = Game;
  const creeps = Object.values(creepsObj);
  const rooms = Object.values(roomsObj);

  console.log(
    creeps.map(runCreep),
    ap([
      roomCreepSpawner,
      setRoomCreeps(creeps),
    ], rooms),
  );

  console.log(
    '---------------------------------------',
  );
  console.log();
});

// Creeps say errors on bobble

// HARFVESTERS SCALING //
// harvesters start with 7 or 8, max slots around spawner
// after container is build, make more harvesters
