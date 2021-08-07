
import { Falsy } from 'rxjs';
import { addCreep2Source, removeCreep2Source } from '../boot/source';
import { ERR_FINISHED_TASKS, ERR_NO_TASK } from '../consts';
import { movable } from '../helpers';
import { CreepTask, CreepTaskResult } from '../types';
import { makeTask } from './makeTask';

//
export const runTasks: (...ts: (CreepTask | Falsy)[]) => (c: Creep) => ReturnCode
  = (...ts) => c => {
    const { repeating, id } = c.memory.task;

    const ct = ts[id];

    if (id >= ts.length) {
      c.memory.task.id = 0;
      return ERR_FINISHED_TASKS;
    }

    if (!ct) {
      console.log('can not run task', c.name, ct, id);
      return ERR_NO_TASK;
    }

    const { code } = ct(c);
    if (code === OK) {
      c.memory.task.repeating = true;

      return code;
    }

    c.memory.task.id = repeating ? 0 : id + 1;
    c.memory.task.repeating = false;

    return runTasks(...ts)(c);
  };

//
export const runTasksFast: (ts: CreepTask[]) => (c: Creep) => ReturnCode
  = ts => c => {
    const [ct] = ts;
    if (!ct) return ERR_NO_TASK;

    const { id } = c.memory.task;
    const { code } = ct(c);

    if (code === OK) return code;

    return runTasksFast(ts.filter((_, _id) => _id !== id))(c);
  };

export const validate = <T extends any[]>(f: (...ps: [...NonNullable<T>]) => CreepTask) => (...ps: [...(T[number] | undefined)[]]) => {
  const noP = ps.find(p => !p);
  if (noP) return (creep: Creep) => ({ creep, code: ERR_INVALID_ARGS, error: ps } as CreepTaskResult);

  return f(...(ps as [...NonNullable<T>]));
};

//
export const harvest = validate((s: Harvestable) =>
  makeTask(
    'harvest',
    movable(c => {
      addCreep2Source(s)(c);

      return c.harvest(s);
    }, s),
  )(
    c => c.store.getFreeCapacity() > 0 ? OK : ERR_FULL,
  ));

//
export const transfer = validate((storable: AnyCreep | AnyStoreStructure) =>
  makeTask(
    'transfer',
    movable(c => {
      removeCreep2Source(c);

      return c.transfer(storable, RESOURCE_ENERGY);
    }, storable))(
    c => c.store.getUsedCapacity() > 0 || (storable.store.getFreeCapacity() || 0) > 0 ? OK : ERR_FULL,
  ));

//
export const withdraw = validate((storable:AnyStoreStructure, cst: Parameters<Creep['build']>[0]) => makeTask(
  'withdraw',
  movable(c => c.withdraw(storable, RESOURCE_ENERGY), storable))(
  _ => cst ? OK : ERR_INVALID_TARGET,
  c => c.store.getUsedCapacity() < 1 ? OK : ERR_FULL,
  _ => storable.store.energy >= storable.store.getCapacity(RESOURCE_ENERGY) ? OK : ERR_NOT_ENOUGH_RESOURCES,
));

//
export const build = validate((cst: Parameters<Creep['build']>[0]) =>
  makeTask(
    'build',
    movable(c => c.build(cst), cst))(
    c => c.store.getUsedCapacity() > 0 ? OK : ERR_NOT_ENOUGH_ENERGY,
    _ => cst ? OK : ERR_INVALID_TARGET,
  ));

//
export const upgradeController = validate((ctrl: Parameters<Creep['upgradeController']>[0]) =>
  makeTask(
    'upgradeController',
    movable(c => c.upgradeController(ctrl), ctrl))(
    c => c.store.getUsedCapacity() > 0 ? OK : ERR_NOT_ENOUGH_ENERGY,
  ));
