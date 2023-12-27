package main

import (
	"fmt"
	"log"
	"net/http"
	"os/exec"
	"strings"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{}

func main() {
	fmt.Println("Starting Magic Remote...")

	fs := http.FileServer(http.Dir("./ui"))

	router := http.NewServeMux()
	router.Handle("/socket", http.HandlerFunc(socket));
	router.Handle("/", fs)

	server := http.Server{
		Addr: ":80",		
		Handler: router,
	}

	// Start server
	log.Printf("listening on %s", server.Addr)
	if err := server.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
	fmt.Println("Magic Remote is closing")
}

func socket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("error upgrading: %s", err)
		return
	}
	defer conn.Close()

	for {
		mt, msg, err := conn.ReadMessage()
		if err != nil {
			log.Printf("read error: %s", err)
			break
		}

		if mt == websocket.TextMessage {
			xdotool(msg)
		}
	}

	log.Println("closed connection")
}

func xdotool(args []byte) {
	parts := strings.Split(string(args), " ")
	cmd := exec.Command("xdotool", parts...)
	err := cmd.Run()
	if err != nil {
		log.Printf("error running command: %s", err)
	}
	log.Printf("ran: xdotool %s", args);
}