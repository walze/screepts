import { doOrMove, creepAction } from "../utils"

export const harvesterCreep: creepAction = (creep: Creep) => {
  const creepDoOrMove = doOrMove(creep)

  const [source] = creep.room.find(FIND_SOURCES)

  if (creep.carryCapacity > creep.carry.energy) {
    return creepDoOrMove(creep.harvest(source))(source)('harvest')
  }

  const [target] = creep.room.find(FIND_STRUCTURES, {
    filter: structure => (structure.structureType == STRUCTURE_EXTENSION
      || structure.structureType == STRUCTURE_SPAWN
      || structure.structureType == STRUCTURE_TOWER)
      && structure.energy < structure.energyCapacity
  });

  if (!target) return creep.say('no struc')

  return creepDoOrMove(creep.transfer(target, RESOURCE_ENERGY))(target)('transfering')
}