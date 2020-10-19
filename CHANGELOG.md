+ General changes,
  - Fixed, changing window size during output causes a crash
  - Fixed, inability to reach the game server generates an error message

+ Changes to assets,
  - Fixed, changes to your own mission / vehicle assets are only adopted after a restart
  - Fixed, Ext folder is created if it does NOT exist
  - Fixed, error message is NOT output if an asset file is faulty
  - Optimized, mission asset file is imported and the object is then discarded (performance background)
  - Optimized, vehicle asset file is read in and the object is then discarded (performance background)

+ Changes (Alliance-)Missions,
  - Fixed, trailers (AB, boats, ...) are trying to send, without a carrier vehicle and set to status 6
  - Fixed that the required vehicles must be complete, is ignored
  - Fixed that the set limit is ignored for all use as well as user-specific
  - Fixed, inaccessibility from the game server interrupts the bot in the (re) alerting
  - Added, Halloween event is supported!
  - Optimized, missions are sorted by creation date, before it was the latter
  - Optimized, 'Mission' object also receives the fields 'CountVehicleMissing' and 'CountVehiclePresent'

+ Changes filter,
  - Fixed, (Alliance-)Missions filters without proper naming are NOT ignored
  - Optimized, (Alliance) operations filter is read in and the object is then discarded (performance background)
  - Optimized, (Alliance) operations filter (approval) is read in and the object is then discarded (performance background)

+ Change of speaking requests,
  - Fixed, inaccessibility from the game server interrupts the bot processing the speech requests

+ Mandatory,
  - Error and source code optimization
  - View source code, count lines of code