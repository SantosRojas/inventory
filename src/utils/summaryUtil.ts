import type { Pump } from "../types";

const getInventoryCounts = (pumps: Pump[]) => {
  const services = new Set<string>();
  const models = new Set<string>();
  const institutions = new Set<string>();

  const currentYear = new Date().getFullYear();
  let inventoriedThisYear = 0;

  for (const pump of pumps) {
    services.add(pump.service);
    models.add(pump.model);
    institutions.add(pump.institution);

    if (pump.inventoryDate) {
      const year = new Date(pump.inventoryDate).getFullYear();
      if (year === currentYear) {
        inventoriedThisYear++;
      }
    }
  }

  return {
    serviceCount: services.size,
    modelCount: models.size,
    institutionCount: institutions.size,
    inventoriedThisYear: inventoriedThisYear
  };
};


export default getInventoryCounts;
