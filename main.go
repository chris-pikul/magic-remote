package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	fmt.Println("Starting Magic Remote...")

	fs := http.FileServer(http.Dir("./ui"))

	router := http.NewServeMux()
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


