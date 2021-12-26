declare global {

  type ReturnCode = ScreepsReturnCode
    | -998
    | -997
    | -996
    | -999
  }

export const ERR_NEW_BORN: ReturnCode = -998;
export const ERR_IDLE: ReturnCode = -997;
export const ERR_FINISHED_TASKS: ReturnCode = -996;
export const ERR_NO_TASK: ReturnCode = -999;

export const STORE_STRUCTURES: AnyStoreStructure['structureType'][]
 = [
   'container',
   'storage',
   'extension',
   'powerSpawn',
   'factory',
   'lab',
   'link',
   'nuker',
   'tower',
   'terminal',
   'spawn',
 ];
