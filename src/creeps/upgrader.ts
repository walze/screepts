import { creepAction, doOrMove, ensureCreepHasEnergy } from "../utils"

export const upgraderCreep: creepAction = creep => {
  const [hasEnergy, code] = ensureCreepHasEnergy(creep)
  if (!hasEnergy) return code

  doOrMove
    (creep)
    (creep.upgradeController(creep.room.controller!))
    (creep.room.controller!)
    ('upgrading')
}