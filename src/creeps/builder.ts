import { doOrMove, creepAction, ensureCreepHasEnergy } from "../utils/utils"
import { harvesterCreep } from "./harvester"

export const builderCreep: creepAction = (creep: Creep) => {
  const [site] = creep.room.find(FIND_CONSTRUCTION_SITES)
  if (!site) return harvesterCreep(creep)


  const [hasEnergy] = ensureCreepHasEnergy(creep)
  if (!hasEnergy) return harvesterCreep(creep)

  return doOrMove(creep)(creep.build(site))(site)('build')
}
