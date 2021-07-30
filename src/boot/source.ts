import { countHarvestable, countObjectEntries } from '../helpers';

export const setMaxCreepPerSource = () => {
  // Refactor this
  for (const key in Game.rooms) if (Object.prototype.hasOwnProperty.call(Game.rooms, key)) {
    const room = Game.rooms[key] as Room;
    const sources = room?.find(FIND_SOURCES);

    room.memory.sources = {};
    sources.map(s => (
      room.memory.sources[s.id] = {
        creeps: {},
        total: countHarvestable(s),
      }
    ));
  }
};

export const addCreep2Source
  = (s: Parameters<Creep['harvest']>[0]) => (c: Creep) => c.room.memory.sources[s.id]!.creeps[c.id] = c;

export const removeCreep2Source
    = (s: Parameters<Creep['harvest']>[0]) => (c: Creep) => {
      delete c.room.memory.sources[s.id]!.creeps[c.id];
    };

export const countCreepsUsingSource
  = (s: Parameters<Creep['harvest']>[0]) => countObjectEntries(s.room?.memory.sources[s.id]!.creeps);

export const maxCreepsPerSource
  = (s: Parameters<Creep['harvest']>[0]) => s.room?.memory.sources[s.id]!.total!;

