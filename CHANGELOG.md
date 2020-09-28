+ Changes (General),
  - Fixed that automatic recruiting of staff in available buildings
  - Optimized, activity pool is only initialized after successful login

+ Changes (Alliance-)Missions,
  - Fixed, Association deployment that you created yourself is not recognized as an association assignment
  - Fixed, HTML characters are NOT converted correctly, i.e. missing vehicles NOT re-alerted
  - Fixed, scaling of NEF, RTH and NAW during the first alarm
  - Fixed, scaling the required amount of water generates a large amount of vehicles required
  - Optimized, conditions for the stake pool according to the new classification
  - Optimized, speaking requests (patient / prisoner) with manual synchronization
  - Optimized, the timings updated accordingly
  - Optimized, water consumption reduced from 1000 / vehicle to 800 / vehicle

+ Changes Speeches,
  - Fixed, prisoners / patients are NOT admitted to their own hospitals / prison cells

+ Changes Settings,
  - NEW that automatic scaling of required vehicles (rescue service)
    See: is_vehicle_scaling_enabled ('true' the required amount is automatically scaled, 'false' ignores it)
  - NEW, continue to alarm vehicles for the next use, if missing
    See: is_vehicle_redirect_enabled ('true' alerts vehicles to the next deployment, 'false' ignores it)

+ Mandatory, 
  - Error and source code optimization
  - Source code viewed, lines of code counted