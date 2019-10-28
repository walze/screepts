interface CreepMemory {
}
interface FlagMemory { }
interface PowerCreepMemory { }
interface RoomMemory {
  busySources: { [key: string]: string }
}
interface SpawnMemory { }

type Structures<T> = {
  [STRUCTURE_CONTAINER]: StructureContainer
  [STRUCTURE_CONTROLLER]: StructureContainer
  [STRUCTURE_EXTENSION]: StructureContainer
  [STRUCTURE_EXTRACTOR]: StructureContainer
  [STRUCTURE_KEEPER_LAIR]: StructureContainer
  [STRUCTURE_LAB]: StructureContainer
  [STRUCTURE_LINK]: StructureContainer
  [STRUCTURE_NUKER]: StructureContainer
  [STRUCTURE_OBSERVER]: StructureContainer
  [STRUCTURE_PORTAL]: StructureContainer
  [STRUCTURE_POWER_BANK]: StructureContainer
  [STRUCTURE_POWER_SPAWN]: StructureContainer
  [STRUCTURE_RAMPART]: StructureContainer
  [STRUCTURE_WALL]: StructureContainer
  [STRUCTURE_TOWER]: StructureContainer
  [STRUCTURE_TERMINAL]: StructureContainer
  [STRUCTURE_STORAGE]: StructureContainer
  [STRUCTURE_SPAWN]: StructureContainer
  [STRUCTURE_ROAD]: StructureContainer
}