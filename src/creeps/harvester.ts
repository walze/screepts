import { doOrMove, creepAction } from "../utils"

export const harvesterCreep: creepAction = (creep: Creep) => {
  const creepDoOrMove = doOrMove(creep)

  if (creep.memory.mineIndex === undefined) creep.memory.mineIndex = 0

  const sources = creep.room.find(FIND_SOURCES)

  if (creep.carryCapacity > creep.carry.energy) {
    if (!sources[creep.memory.mineIndex]) creep.memory.mineIndex = 0

    const source = sources[creep.memory.mineIndex]

    const code = creepDoOrMove(creep.harvest(source))(source)('harvest')
    if (code === -2) creep.memory.mineIndex++

    return
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