import { countHarvestable, countObjectEntries } from '../helpers';

export const setMaxCreepPerSource = () => {
  // Refactor this ?
  for (const key in Game.rooms) if (Object.prototype.hasOwnProperty.call(Game.rooms, key)) {
    const room = Game.rooms[key] as Room;
    if (room.memory.sources) return;

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
  = (s: Harvestable) => (c: Creep) => c.room.memory.sources[s.id]!.creeps[c.id] = c;

// Hacky?
export const removeCreep2Source
    = () => (c: Creep) => {
      for (const key in c.room.memory.sources) if (Object.prototype.hasOwnProperty.call(c.room.memory.sources, key))
        delete c.room.memory.sources[key]!.creeps[c.id];
    };

export const countCreepsUsingSource
  = (s: Harvestable) => countObjectEntries(s.room?.memory.sources[s.id]!.creeps);

export const maxCreepsPerSource
  = (s: Harvestable) => s.room?.memory.sources[s.id]!.total!;

