import {applyTo, gt, pipeWith, PipeWithFns} from 'ramda';
import {ReturnCode} from '../consts';
import {CreepTask, CreepTaskResult, Tasks} from '../types';

export const taskBind = (...fns: CreepTask[]) => pipeWith(
  (f: CreepTask, {code, creep, name}: CreepTaskResult) => code === OK
    ? {code, creep, name}
    : f(creep),
)(fns as PipeWithFns<CreepTaskResult, CreepTaskResult>);

export const makeTask
  = <T extends Tasks>(name: T, doTask: (c: Creep) => ReturnCode) =>
    (...conditions: Array<(c: Creep) => ReturnCode>) =>
      (creep: Creep): CreepTaskResult => {
        const testConditions = () => conditions
          .map(applyTo(creep))
          .find(gt(0));

        const code = testConditions() || doTask(creep);

        if (code === OK) {
          creep.say(`${name}`);
        }

        // Side-effects
        creep.memory.task.name = name;
        creep.memory.task.code = code;
        console.log(`${creep.name} task -> ${name} | ${code}`);

        return {creep, code, name};
      };

