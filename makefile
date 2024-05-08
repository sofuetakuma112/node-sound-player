.PHONY: all run ngrok

all: run ngrok

run:
	cd backend && node index.js &

ngrok:
	ngrok http --domain=kiwi-pro-koala.ngrok-free.app 3000