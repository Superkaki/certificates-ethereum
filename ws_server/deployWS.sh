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

function check_and_install_missing(){
	subtitle "1. check and install"

	if command_exists "curl"; then
		ok "curl found"
	else
		fail "curl not found. Installing..."
		log "Updating apt-get"
		sudo apt-get update
		log "Installing curl"
		sudo apt install curl
	fi 

	if command_exists "node"; then
		ok "node.js found"
	else
		fail "node.js not found. Installing..."
		log "Updating apt-get"
		sudo apt-get update
		log "Installing nodejs"
		curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
		sudo apt-get install -y nodejs
	fi

	if command_exists "npm"; then
		ok "npm found"
	else
		fail "npm not found. Installing..."
		log "Updating apt-get"
		sudo apt-get update
		log "Installing npm"
		sudo apt-get install npm
	fi

	if command_exists "truffle"; then
		ok "truffle found"
	else
		fail "truffle not found. Installing..."
		log "Updating apt-get"
		sudo apt-get update
		log "Installing truffle"
		sudo npm install -g truffle
	fi 

	if command_exists "yarn"; then
		ok "yarn found"
	else
		fail "yarn not found. Installing..."
		curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
		log "Updating apt-get"
		sudo apt-get update
		log "Installing yarn"
		sudo apt-get install yarn
	fi 
}

function install_modules(){
	subtitle "3. loading dependencies..."
	if [[ -d "node_modules" ]]; then
		ok "node_modules folder found. skipping download"
	else
		fail "node_modules not found. Downloading"
		log "Installing..."
		yarn install
		log "Upgrading..."
		yarn upgrade
	fi
}

title "Checking system requirements for websocket..."
check_and_install_missing
install_modules

title "Deploying dev server now..."
yarn start