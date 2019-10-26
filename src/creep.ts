import { harvesterCreep } from "./creeps/harvester"
import { builderCreep } from "./creeps/builder"
import { creepAction } from "./utils"

export type runCreep = { [key in CREEP_TYPES]: creepAction }
export enum CREEP_TYPES {
  HARVESTER = 'HARVESTER',
  BUILDER = 'BUILDER',
}



export const runCreep: runCreep = {
  [CREEP_TYPES.HARVESTER]: harvesterCreep,
  [CREEP_TYPES.BUILDER]: builderCreep,
}

export const spawnCreep = (spawn: StructureSpawn) => (type: string, id: number) =>
  spawn.spawnCreep(
    [WORK, CARRY, MOVE],
    `${type}_${id}`,
    {
      memory: { type, id }
    }
  )
