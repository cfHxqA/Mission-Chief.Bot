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
  if [[ $(tmux list-sessions -F '#{session_name}') =~ Mission-Chief ]]; 
  then 
    ScreenId=${BASH_REMATCH[1]};

    Process=pstree $(tmux list-panes -s -F '#{pane_pid}' -t $ScreenId)
    if [[ $Process =~ "dotnet" ]];
    then
      echo "Bot is running!"
    else
      echo "Bot is stopped! Start it again..."
      dotnet BotNix.App.dll &
    fi

    sleep $TimeoutValidation
    ValidateProccess &
  else 
    tmux new-session -d -s "Mission-Chief" "cd $BaseDirectory; dotnet BotNix.App.dll" 
    echo "Screen created and bot started!"

    sleep $TimeoutValidation
    ValidateProccess &
  fi
}

ValidateProccess &