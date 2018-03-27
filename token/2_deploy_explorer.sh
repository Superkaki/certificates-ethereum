#!/bin/bash

ganache=ganache-1.0.1-x86_64.AppImage
if [[ ! -f $ganache ]]; then
	wget https://github.com/trufflesuite/ganache/releases/download/v1.0.1/$ganache
fi
chmod +x $ganache
./$ganache