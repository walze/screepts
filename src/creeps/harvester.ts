import { doOrMove, creepAction, findInObjByValue } from "../utils"

const transferEnergy = (creep: Creep) =>
  (structure: AnyStructure) => doOrMove(creep)(creep.transfer(structure, RESOURCE_ENERGY))(structure)('transfering')

export const harvesterCreep: creepAction = (creep: Creep) => {
  if (!creep.room.memory.busySources) creep.room.memory.busySources = {}
  const creepDoOrMove = doOrMove(creep)
  const creepTransferEnergy = transferEnergy(creep)

  console.log(creep.room.memory.busySources['5bbcae259099fc012e638772'], Date.now())

  const source = creep.pos.findClosestByPath(FIND_SOURCES, {
    filter: s => !s.room.memory.busySources[s.id] || s.room.memory.busySources[s.id] === creep.id
  })

  if (source && creep.carryCapacity > creep.carry.energy) {
    creep.room.memory.busySources[source.id] = creep.id

    return creepDoOrMove(creep.harvest(source))(source)('harvest')
  }

  const memoryBusySource = findInObjByValue(creep.room.memory.busySources, creep.id)
  if (memoryBusySource) delete creep.room.memory.busySources[memoryBusySource[0]]

  const [powerStruct] = creep.room.find(FIND_STRUCTURES, {
    filter: structure => (structure.structureType == STRUCTURE_EXTENSION
      || structure.structureType == STRUCTURE_SPAWN
      || structure.structureType == STRUCTURE_TOWER)
      && structure.energy < structure.energyCapacity
  });

  if (!powerStruct) {
    const container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: structure => structure.structureType == STRUCTURE_CONTAINER
        && structure.store.energy < structure.storeCapacity
    });

    if (!container) return creep.say('no struc')

    return creepTransferEnergy(container)
  }

  return creepTransferEnergy(powerStruct)
}