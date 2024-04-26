CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL
);

CREATE TABLE outbox_events (
  id BIGSERIAL,
  aggregatetype TEXT NOT NULL CHECK (
    aggregatetype IN (
    'INSERTED',
    'UPDATED',
    'DELETED'
  )),
  aggregateid BIGSERIAL NOT NULL,
  payload BYTEA NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW()  
);