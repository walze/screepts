
export enum ROLES {
  BUILDER = 'BUILDER',
  HAVESTER = 'HAVESTER',
  UPGRADER = 'UPGRADER',
}

type ROLE = keyof typeof ROLES

declare global {
  interface CreepMemory {
    role: ROLE
  }

  interface FlagMemory { }
  interface PowerCreepMemory { }
  interface RoomMemory {
  }

  interface SpawnMemory { }
}

type Structures = {
  [STRUCTURE_CONTAINER]: StructureContainer
  [STRUCTURE_CONTROLLER]: StructureController
  [STRUCTURE_EXTENSION]: StructureExtension
  [STRUCTURE_EXTRACTOR]: StructureExtractor
  [STRUCTURE_KEEPER_LAIR]: StructureKeeperLair
  [STRUCTURE_LAB]: StructureLab
  [STRUCTURE_LINK]: StructureLink
  [STRUCTURE_NUKER]: StructureNuker
  [STRUCTURE_OBSERVER]: StructureObserver
  [STRUCTURE_PORTAL]: StructurePortal
  [STRUCTURE_POWER_BANK]: StructurePowerBank
  [STRUCTURE_POWER_SPAWN]: StructurePowerSpawn
  [STRUCTURE_RAMPART]: StructureRampart
  [STRUCTURE_WALL]: StructureWall
  [STRUCTURE_TOWER]: StructureTower
  [STRUCTURE_TERMINAL]: StructureTerminal
  [STRUCTURE_STORAGE]: StructureStorage
  [STRUCTURE_SPAWN]: StructureSpawn
  [STRUCTURE_ROAD]: StructureRoad
}
