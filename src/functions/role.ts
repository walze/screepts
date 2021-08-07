import { build, harvest, runTasks, transfer, upgradeController, withdraw } from './tasks';

export const runHarvester = (source?: Source, storable?: AnyStoreStructure) => runTasks(
  harvest(source),
  transfer(storable),
);

export const runBuilder = (storable?: AnyStoreStructure, construction?: ConstructionSite<BuildableStructureConstant>, source?: Source) => runTasks(
  // Delete construction?
  withdraw(storable, construction),
  harvest(source),
  build(construction),
  transfer(storable),
);

export const runUpgrader = (storable?: AnyStoreStructure, construction?: ConstructionSite<BuildableStructureConstant>, source?: Source, controller?: StructureController) => runTasks(
  withdraw(storable, construction),
  harvest(source),
  upgradeController(controller),
  transfer(storable),
);
