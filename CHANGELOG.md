+ CHANGES Settings,
  - NEW, building.hire.is_enabled - Determines whether or not staff is automatically recruited
  - NEW, building.hire.duration - Defines the duration between 1, 2 or 3 days

+ CHANGES Share,
  - NEW, share.estimated_duration - Defines the time when a mission will be processed normally AFTER the release (only applies if standard vehicles are specified)
  - NEW, share.message - Specifies the text that is communicated to the Alliance when a mission is released (Placeholder: {Address}, {Credits}, {Place})

+ Changes missions,
  - NEW, if the bot is at a standstill, the mission list is "triggered" again in a random and short interval
  - Fixed bug that the created time stamp of the mission is overwritten and reset when updating
  - Fixed bug that the mission will NOT be checked again if the created timestamp is overwritten

+ Mandatory, 
  - Error and source code optimization
  - Source code viewed, lines of code counted