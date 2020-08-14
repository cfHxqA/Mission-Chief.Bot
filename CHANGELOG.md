+ CHANGES General,
  - Recordings are saved in the yyyy-MM-dd format instead of yyyy-dd-MM as before
  - Commands are disabled for now to reduce the CPU load
  - NEW, changes in the config.mscc are applied without restart

+ CHANGES Missions,
  - NEW, capacity_patient option defines how many hospital beds are left free
  - NEW, capacity_prisoner option defines how many prison cells are left free
  - NEW, capacity_alliance_patient option defines how many hospital beds are left free
  - NEW, capacity_alliance_prisoner option defines how many prison cells are left free
  - NEW, is_requests_enabled option determines whether a use WITH patients is enabled or not
  - NEW, remaining_duration option defines the remaining time until a further alarm can be issued for an operation (in seconds)

  - Own missions that are NOT approached AND released with a standard vehicle will be processed normally from now on

+ Mandatory, 
  - Error and source code optimization
  - Source code viewed, lines of code counted