import { doOrMove, creepAction } from "../utils"
import { harvesterCreep } from "./harvester"

export const builderCreep: creepAction = (creep: Creep) => {
  const [site] = creep.room.find(FIND_CONSTRUCTION_SITES)
  if (!site) return harvesterCreep(creep)

  const creepDoOrMove = doOrMove(creep)

  const [spawn] = creep.room.find(FIND_MY_SPAWNS)
  if (spawn.energy < 50) return harvesterCreep(creep)

  if (creep.carry.energy < 1) {
    return creepDoOrMove(creep.withdraw(spawn, RESOURCE_ENERGY))(spawn)('getting energy')
  }

  return creepDoOrMove(creep.build(site))(site)('build')

}