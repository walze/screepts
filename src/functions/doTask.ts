import {applyTo, gt, pair, pipeWith, PipeWithFns} from 'ramda';

export type Position = RoomPosition | { pos: RoomPosition }
export type CreepTask = (c: CreepTaskResult) => CreepTaskResult

type KeysOfType<C, T> = {
  [K in keyof C]: C[K] extends T ? K : never
}[keyof C]

type K = KeysOfType<Creep, (...args: any) => any>
export type CreepTaskResult = [Creep, number[]]

export const taskBind = (...fns: CreepTask[]) => pipeWith(
  (f: CreepTask, [c, [n, ...r]]: CreepTaskResult) => n === OK
    ? pair(c, [n, ...r])
    : f(pair(c, [n!, ...r])),
)(fns as PipeWithFns<CreepTaskResult, CreepTaskResult>);

export const doTask
  = <P extends K>(name: P, doTask: (c: Creep) => ScreepsReturnCode) =>
    (...conditions: Array<(c: Creep) => ScreepsReturnCode>): CreepTask =>
      ([creep, n]) => {
        console.log(name, doTask, conditions, creep, n);

        const testConditions = () => conditions
          .map(applyTo(creep))
          .find(gt(0));

        const code = testConditions() || doTask(creep);

        console.log('creep task ->', name, code);
        creep.say(`${name} -> ${code}`);

        // Side-effects
        creep.memory.task = name;
        creep.memory.taskCode = code;

        return [creep, [code, ...n]];
      };

