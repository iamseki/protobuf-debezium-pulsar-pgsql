package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	products "github.com/iamseki/protobuf-debezium-pulsar/gen/go/store/v1"
	_ "github.com/jackc/pgx/v5/stdlib" // Setup Postgres driver
	"github.com/jmoiron/sqlx"
	"google.golang.org/protobuf/proto"
)

type OutboxEvent struct {
	AggregateID     int32  `db:"aggregateid"`
	AggregateType   string `db:"aggregatetype"`
	TransactionType string `db:"transaction_type"`
	Payload         []byte `db:"payload"`
}

type Product struct {
	ID          int32   `json:"id" db:"id"`
	Name        string  `json:"name" db:"name"`
	Description string  `json:"description" db:"description"`
	Price       float32 `json:"price" db:"price"`
}

// Handler function to handle the POST request
func createProduct(w http.ResponseWriter, r *http.Request, db *sqlx.DB) {
	defer r.Body.Close()

	// Decode the request body into a Product struct
	product := &Product{}
	err := json.NewDecoder(r.Body).Decode(&product)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Error decoding request body: %v", err)
		return
	}
	ctx := context.TODO()
	tx, err := db.BeginTxx(ctx, nil)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "begin trx error: %v", err)
		return
	}

	args := []interface{}{
		product.Name,
		product.Description,
		product.Price,
	}
	err = tx.QueryRowxContext(ctx, "INSERT INTO products (name, description, price) VALUES ($1, $2, $3) RETURNING *", args...).StructScan(product)
	if err != nil {
		tx.Rollback()
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "insert into products error: %v", err)
		return
	}

	log.Printf("inserted: %v", product)

	outboxEventPayload := &products.Product{
		Id:          product.ID,
		Name:        product.Name,
		Description: product.Description,
		Price:       product.Price,
		Action:      products.Action_ACTION_INSERT,
	}

	payload, err := proto.Marshal(outboxEventPayload)
	if err != nil {
		tx.Rollback()
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "proto marshal error: %v", err)
		return
	}

	outboxEvent := &OutboxEvent{
		AggregateID:   product.ID,
		AggregateType: "INSERTED",
		Payload:       payload,
	}

	log.Printf("outboxEvent payload: %v\n", outboxEvent.Payload)
	_, err = tx.NamedExecContext(ctx, "INSERT INTO outbox_events (aggregatetype, aggregateid, payload) VALUES (:aggregatetype, :aggregateid, :payload)", outboxEvent)
	if err != nil {
		tx.Rollback()
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "insert into outbox events error: %v", err)
		return
	}

	tx.Commit()
	fmt.Fprintf(w, "Product created successfully: %+v", product)
}

func main() {
	// Connect to PostgreSQL database using sqlx
	db, err := sqlx.Connect("pgx", "postgres://test:test@localhost:5432/store?sslmode=disable")
	if err != nil {
		fmt.Println("Error connecting to database:", err)
		return
	}
	defer db.Close()

	// Initialize router and register a handler
	router := mux.NewRouter()
	router.HandleFunc("/product", func(w http.ResponseWriter, r *http.Request) { createProduct(w, r, db) }).Methods(http.MethodPost)

	// Start server on port 8080 (adjust as needed)
	fmt.Println("Starting server on port 8080")
	if err := http.ListenAndServe(":8080", router); err != nil {
		fmt.Println("Error starting server:", err)
	}
}
