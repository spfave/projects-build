package http_utils

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func JsonDecode[T any](r *http.Request) (T, error) {
	defer r.Body.Close()

	var data T
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		return data, fmt.Errorf("failed to decode from json: %w", err)
	}
	return data, nil
}

func JsonEncode[T any](w http.ResponseWriter, status int, data T) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(data); err != nil {
		return fmt.Errorf("failed to encode to json: %w", err)
	}
	return nil
}
