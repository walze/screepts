import { doOrMove, creepAction } from "../utils"
import { harvesterCreep } from "./harvester"

export const builderCreep: creepAction = (creep: Creep) => {
  const [site] = creep.room.find(FIND_CONSTRUCTION_SITES)
  if (!site) return harvesterCreep(creep)

  const creepDoOrMove = doOrMove(creep)

  
  if (creep.carry.energy < creep.carryCapacity) {
    const [spawn] = creep.room.find(FIND_MY_SPAWNS)

    return creepDoOrMove(creep.withdraw(spawn, RESOURCE_ENERGY))(spawn)('getting energy')
  }

  return creepDoOrMove(creep.build(site))(site)('build')

}