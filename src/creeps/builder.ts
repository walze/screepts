import { doOrMove, creepAction, ensureCreepHasEnergy } from "../utils/utils"
import { harvesterCreep } from "./harvester"

export const builderCreep: creepAction = (creep: Creep) => {
  const [site] = creep.room.find(FIND_CONSTRUCTION_SITES)
  if (!site) return [false, 'no_site']


  const [hasEnergy, energyCode] = ensureCreepHasEnergy(creep)
  if (!hasEnergy) return [hasEnergy, energyCode || 'no_energy']

  return doOrMove(creep)(creep.build(site))(site)('build')
}
