import { harvesterCreep } from "./creeps/harvester"
import { builderCreep } from "./creeps/builder"
import { creepAction, ACTION_DONE } from "./utils/utils"
import { upgraderCreep } from "./creeps/upgrader"

export enum CREEP_ACTIONS {
  HARVESTING,
  BUILDING,
  FLEEING,
  UPGRADING,
}

export enum CREEP_TYPES {
  HARVESTER,
  BUILDER,
  UPGRADER,
}

export const creepActions: { [key in CREEP_TYPES]: creepAction } = {
  [CREEP_TYPES.HARVESTER]: harvesterCreep,
  [CREEP_TYPES.BUILDER]: builderCreep,
  [CREEP_TYPES.UPGRADER]: upgraderCreep,
}

export const runCreep = (creep: Creep) => {
  const { actions } = creep.memory
  if (!actions[creep.memory.actionIndex]) creep.memory.actionIndex = 0

  const [action, whenDone, whenError] = actions[creep.memory.actionIndex]
  const [succ, actionCode] = creepActions[action](creep)

  if (actionCode === 0) {
    // default = start
    if (!whenDone) return creep.memory.actionIndex = 0
    if (whenDone === ACTION_DONE.START) return creep.memory.actionIndex = 0
    if (whenDone === ACTION_DONE.PREVIOUS) return creep.memory.actionIndex--
    if (whenDone === ACTION_DONE.NEXT) return creep.memory.actionIndex++
  } else {
    if (!succ) creep.say(actionCode.toString())

    // default = next
    if (!whenError) return creep.memory.actionIndex++
    if (whenError === ACTION_DONE.START) return creep.memory.actionIndex = 0
    if (whenError === ACTION_DONE.PREVIOUS) return creep.memory.actionIndex--
    if (whenError === ACTION_DONE.NEXT) return creep.memory.actionIndex++
  }

  if (!succ) creep.say(actionCode.toString())
}


export const spawnCreep = (spawn: StructureSpawn) =>
  (type: CREEP_TYPES, body: BodyPartConstant[] = [WORK, CARRY, MOVE, MOVE]) =>
    (...actions: CreepMemory['actions']) => {
      const name = `${CREEP_TYPES[type]}_${Date.now()}`

      const code = spawn.spawnCreep(
        body,
        name,
        { memory: { type, actions, actionIndex: 0 } },
      )

      return code
    }


export const spawnHarvester = (spawn: StructureSpawn) =>
  spawnCreep
    (spawn)
    (CREEP_TYPES.HARVESTER)
    (
      [CREEP_TYPES.HARVESTER],
    )


export const spawnBuilder = (spawn: StructureSpawn) =>
  spawnCreep
    (spawn)
    (CREEP_TYPES.BUILDER)
    (
      [CREEP_TYPES.BUILDER],
      [CREEP_TYPES.HARVESTER],
    )


export const spawnUpgrader = (spawn: StructureSpawn) =>
  spawnCreep
    (spawn)
    (CREEP_TYPES.UPGRADER)
    (
      [CREEP_TYPES.UPGRADER],
      [CREEP_TYPES.HARVESTER],
    )

