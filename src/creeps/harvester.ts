import { doOrMove, creepAction, findInObjByValue, eitherFunction } from "../utils/utils"
import { findClosestPowerUsingStructure, findClosestStructure } from "../utils/find"

const transferEnergy = (creep: Creep) =>
  (structure: AnyStructure) => doOrMove(creep)(creep.transfer(structure, RESOURCE_ENERGY))(structure)('transfering')

export const harvesterCreep: creepAction = (creep: Creep) => {
  if (!creep.room.memory.busySources) creep.room.memory.busySources = {}
  const creepDoOrMove = doOrMove(creep)
  const creepTransferEnergy = transferEnergy(creep)

  const source = creep.pos.findClosestByPath(FIND_SOURCES, {
    filter: s => !s.room.memory.busySources[s.id] || s.room.memory.busySources[s.id] === creep.id
  })

  if (source && creep.carryCapacity > creep.carry.energy) {
    creep.room.memory.busySources[source.id] = creep.id

    return creepDoOrMove(creep.harvest(source))(source)('harvest')
  }

  const memoryBusySource = findInObjByValue(creep.room.memory.busySources, creep.id)
  if (memoryBusySource) delete creep.room.memory.busySources[memoryBusySource[0]]


  // transfer logic
  const powerStructure = () => findClosestPowerUsingStructure(
    creep,
    (structure) => structure.energy < structure.energyCapacity,
  )

  const containerStructure = () => findClosestStructure(creep.pos)(
    STRUCTURE_CONTAINER,
    (structure) => structure.store.energy < structure.storeCapacity,
  );

  const strucuture = eitherFunction(powerStructure, containerStructure)()
  if (!strucuture) return 'NO_STRUCT'

  return creepTransferEnergy(strucuture)
}
