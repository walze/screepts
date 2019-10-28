import { harvesterCreep } from "./creeps/harvester"
import { builderCreep } from "./creeps/builder"
import { creepAction } from "./utils"
import { upgraderCreep } from "./creeps/upgrader"

export type runCreep = { [key in CREEP_TYPES]: creepAction }
export enum CREEP_TYPES {
  HARVESTER = 'HARVESTER',
  BUILDER = 'BUILDER',
  UPGRADER = 'UPGRADER',
}



export const runCreep: runCreep = {
  [CREEP_TYPES.HARVESTER]: harvesterCreep,
  [CREEP_TYPES.BUILDER]: builderCreep,
  [CREEP_TYPES.UPGRADER]: upgraderCreep,
}

export const spawnCreep = (spawn: StructureSpawn) => (type: string, body: BodyPartConstant[] = [WORK, CARRY, MOVE, MOVE]) => {
  const name = `${type}_${Date.now()}`
  const code = spawn.spawnCreep(
    body,
    name,
    {
      memory: { type }
    }
  )

  return code
}
