import { Structures } from "../..";
import { CREEP_TYPES } from "../creep";

export const findClosestStructure = (pos: RoomPosition) =>
  <T extends keyof Structures>(
    structure: T,
    filter = (s: Structures[T]) => true,
  ) =>
    pos.findClosestByRange(
      FIND_STRUCTURES,
      {
        filter: (struct: Structures[T]) => struct.structureType === structure && filter(struct),
      },
    ) as Structures[T] | null


export const findCreepsByType = (room: Room) => (type: CREEP_TYPES) => room
  .find(
    FIND_MY_CREEPS,
    { filter: (creep) => creep.memory.type === type },
  )

export type PowerUsingStructure = Structures[STRUCTURE_EXTENSION | STRUCTURE_SPAWN | STRUCTURE_TOWER]
export const findClosestPowerUsingStructure = (
  creep: Creep,
  filter = (s: PowerUsingStructure) => true,
) => creep.pos
  .findClosestByRange(FIND_STRUCTURES, {
    filter: (structure) => (structure.structureType === STRUCTURE_EXTENSION
      || structure.structureType === STRUCTURE_SPAWN
      || structure.structureType === STRUCTURE_TOWER)
      && filter(structure),
  }) as PowerUsingStructure | null
