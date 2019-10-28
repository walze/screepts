import { creepAction, doOrMove, ensureCreepHasEnergy } from "../utils/utils"
import { harvesterCreep } from "./harvester"

export const upgraderCreep: creepAction = creep => {
  const [hasEnergy] = ensureCreepHasEnergy(creep)
  if (!hasEnergy) return harvesterCreep(creep)

  doOrMove
    (creep)
    (creep.upgradeController(creep.room.controller!))
    (creep.room.controller!)
    ('upgrading')
}