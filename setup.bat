@echo off
REM Setup DIESEL CONNECT properly - Run in CMD inside DIESEL CONNECT folder
REM Path: C:\Users\VAT PRODUCTION\Desktop\C6 Group Code Base\DIESEL CONNECT

echo === DIESEL CONNECT - Proper Setup ===

cd /d "%~dp0"

REM Frontend
cd frontend
if not exist node_modules npm install
cd ..

REM Tools - lean clones only
cd tools
if not exist documenso git clone https://github.com/documenso/documenso
if not exist cal.com git clone https://github.com/calcom/cal.com
if not exist nocodb git clone https://github.com/nocodb/nocodb
if not exist coolify git clone https://github.com/coollabsio/coolify
if not exist n8n git clone https://github.com/n8n-io/n8n
if not exist plausible git clone https://github.com/plausible/analytics plausible
if not exist listmonk git clone https://github.com/knadh/listmonk
if not exist pocketbase git clone https://github.com/pocketbase/pocketbase
if not exist excalidraw git clone https://github.com/excalidraw/excalidraw
if not exist dub git clone https://github.com/dubinc/dub
cd ..

echo Done - Open VS Code: code .
pause
