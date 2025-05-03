package http_utils

import (
	"encoding/json"
	"fmt"
	"io"
	"maps"
	"net/http"
)

// ----------------------------------------------------------------------------------- //
// Ref: https://go.dev/blog/json
// Ref: https://lets-go-further.alexedwards.net/sample/03.02-json-encoding.html

func JsonDecode[T any](r *http.Request) (T, error) {
	if r.Body == nil {
		return *new(T), fmt.Errorf("request body is absent")
	}

	var data T
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		return *new(T), fmt.Errorf("failed to decode request json body: %w", err)
	}

	return data, nil
}

func JsonEncode[T any](w http.ResponseWriter, status int, data T) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(data); err != nil {
		return fmt.Errorf("failed to encode data to json and write response: %w", err)
	}

	return nil
}

func JsonUnmarshal[T any](r *http.Request) (T, error) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		return *new(T), fmt.Errorf("failed to read request body: %w", err)
	}

	var data T
	err = json.Unmarshal(body, &data)
	if err != nil {
		return *new(T), fmt.Errorf("failed to unmarshal request json body: %w", err)
	}

	return data, nil
}

func JsonMarshal[T any](w http.ResponseWriter, status int, data T, headers http.Header) error {
	js, err := json.Marshal(data)
	if err != nil {
		return fmt.Errorf("failed to marshal data to json: %w", err)
	}

	maps.Copy(w.Header(), headers)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_, err = w.Write(js)
	if err != nil {
		return fmt.Errorf("failed to write response: %w", err)
	}

	return nil
}
