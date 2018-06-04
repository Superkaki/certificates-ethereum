#!/bin/bash

#custom terminal colores
bold_red=`tput bold; tput setaf 1`
bold_green=`tput bold; tput setaf 2`
bold_yellow=`tput bold; tput setaf 3`
bold_blue=`tput bold; tput setaf 4`
bold_magenta=`tput bold; tput setaf 5`
bold_cyan=`tput bold; tput setaf 6`
bold_white=`tput bold; tput setaf 7`

normal_red=`tput setaf 1`
normal_green=`tput setaf 2`
normal_yellow=`tput setaf 3`
normal_blue=`tput setaf 4`
normal_magenta=`tput setaf 5`
normal_cyan=`tput setaf 6`
normal_white=`tput setaf 7`

reset=`tput sgr0`

function fail(){
	echo "${bold_red}	[ FAIL ]      $1${reset}"
}

function ok(){
	echo "${bold_green}	[ SUCCESS ]   $1${reset}"
}

function log(){
	echo "${bold_yellow}	[ LOG ]       $1${reset}"
}

function title(){
	#convert to uppercase
	val=$(echo "$1" | tr '[:lower:]' '[:upper:]')
	echo "
${bold_white}
 $val
${reset}"
}

function subtitle(){
	#convert to lowercase
	val=$(echo "$1" | tr '[:upper:]' '[:lower:]')
	echo "${bold_white}
	$val
${reset}"
}

function command_exists() {
  #this should be a very portable way of checking if something is on the path
  #usage: "if command_exists foo; then echo it exists; fi"
  type "$1" &> /dev/null
}

function deleteJSONs() {
	rm build/contracts/Migrations.json
	rm build/contracts/Certifikate.json	
}

function main(){
	title "Deploying Certificates Blockchain demo..."
	subtitle "Deploying ganache ethereum node..."
	cd ./token
	#deleteJSONs

	#log "Deploying ganache..."
	#bash ./2_deploy_explorer.sh &
	#log "Deploying smart contract"
	#bash ./3_deploy_smart_contract.sh
	
	#log "Running log window"
	#gnome-terminal -x truffle develop --log
	#log "Running console"
	#truffle develop
	###### Prueba: Certifikate.deployed().then(function(instance){return instance.setCert();});
	
	subtitle "Deploying http server..."
	cd ../http_server
	log "Deploying webserver..."
	bash ./dev.sh &
	
	subtitle "Deploying websocket server..."
	cd ../ws_server
	log "Deploying websocket server..."
	bash ./deployWS.sh
}

main