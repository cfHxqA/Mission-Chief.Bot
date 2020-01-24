#!/bin/bash
: '
 * @author     cfHxqA
 * @copyright  2019 - 2020 (C) by cfHxqA
 *
 * @package    BotNix.MissionChief
 * @category   Mission-Chief
 *
 * @license    Attribution-NonCommercial-NoDerivs 4.0 Unported <http://creativecommons.org/licenses/by-nc-nd/4.0/>
'
# declare the base directry to the bot
BaseDirectory="/root/MSC-Bot"

# declare the timeout for checking if process is terminated
TimeoutValidation=60

function ValidateProccess {
  if [[ $(eval screen -ls) =~ ([0-9]+)\.Mission-Chief\.Bot ]]; 
  then 
    ScreenId=${BASH_REMATCH[1]};

    file=$(eval pstree $ScreenId)
    if [[ $file =~ "dotnet" ]];
    then
      echo "Bot is running!"
    else
      echo "Bot is stopped! Start it again..."
      dotnet BotNix.App.dll &
    fi

    sleep $TimeoutValidation
    ValidateProccess &
  else 
    screen -dmS "Mission-Chief.Bot" bash -c "cd $BaseDirectory; dotnet BotNix.App.dll" 
    echo "Screen created and bot started!"

    sleep $TimeoutValidation
    ValidateProccess &
  fi
}

ValidateProccess &