
import { addCreep2Source, removeCreep2Source } from '../boot/source';
import { ERR_NO_TASK, ReturnCode } from '../consts';
import { movable } from '../helpers';
import { CreepTask } from '../types';
import { makeTask } from './makeTask';

export const runTasks: (ts: CreepTask[]) => (c: Creep) => ReturnCode
  = ts => c => {
    const { repeating, id } = c.memory.task;

    const ct = ts[id];
    if (!ct) {
      c.memory.task.id = 0;
      return ERR_NO_TASK;
    }

    const { code } = ct(c);
    if (code === OK) {
      c.memory.task.repeating = true;

      return code;
    }

    c.memory.task.id = repeating ? 0 : id + 1;
    c.memory.task.repeating = false;

    return runTasks(ts)(c);
  };

export const runTasksFast: (ts: CreepTask[]) => (c: Creep) => ReturnCode
  = ts => c => {
    const [ct] = ts;
    if (!ct) return ERR_NO_TASK;

    const { id } = c.memory.task;
    const { code } = ct(c);

    if (code === OK) return code;

    return runTasks(ts.filter((_, _id) => _id !== id))(c);
  };

export const harvest = (so: Parameters<Creep['harvest']>[0]) => makeTask(
  'harvest',
  movable(c => {
    addCreep2Source(so)(c);

    return c.harvest(so);
  }, so),
  removeCreep2Source(so),
)(
  c => c.store.getFreeCapacity() > 0 ? OK : ERR_FULL,
);

export const transfer = (storable: AnyCreep | AnyStoreStructure) => makeTask(
  'transfer',
  movable(c => c.transfer(storable, RESOURCE_ENERGY), storable))(
  c => c.store.getUsedCapacity() > 0 || (storable.store.getFreeCapacity() || 0) > 0 ? OK : ERR_FULL,
);

export const withdraw = (storable: AnyStoreStructure, cst: Parameters<Creep['build']>[0]) =>
  makeTask(
    'withdraw',
    movable(c => c.withdraw(storable, RESOURCE_ENERGY), storable))(
    _ => cst ? OK : ERR_INVALID_TARGET,
    c => c.store.getUsedCapacity() < 1 ? OK : ERR_FULL,
    _ => storable.store.energy >= storable.store.getCapacity(RESOURCE_ENERGY) ? OK : ERR_NOT_ENOUGH_RESOURCES,
  );

export const build = (cst: Parameters<Creep['build']>[0]) =>
  makeTask(
    'build',
    movable(c => c.build(cst), cst))(
    c => c.store.getUsedCapacity() > 0 ? OK : ERR_NOT_ENOUGH_ENERGY,
    _ => cst ? OK : ERR_INVALID_TARGET,
  );

export const upgradeController = (ctrl?: Parameters<Creep['upgradeController']>[0]) =>
  makeTask(
    'upgradeController',
    movable(c => c.upgradeController(ctrl!), ctrl!))(
    _ => ctrl ? OK : ERR_INVALID_TARGET,
    c => c.store.getUsedCapacity() > 0 ? OK : ERR_NOT_ENOUGH_ENERGY,
  );
