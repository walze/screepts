export type ReturnCode = ScreepsReturnCode
  | typeof ERR_NO_TASK

export const ERR_NO_TASK = -999;

export const STORE_STRUCTURES: AnyStoreStructure['structureType'][]
 = [
   'container',
   'extension',
   'factory',
   'lab',
   'link',
   'nuker',
   'powerSpawn',
   'spawn',
   'storage',
   'tower',
   'terminal',
 ];
