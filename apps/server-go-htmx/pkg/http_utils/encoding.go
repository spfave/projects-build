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
	defer r.Body.Close()

	var data T
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		return *new(T), fmt.Errorf("failed to decode from json: %w", err)
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

func JsonUnmarshal[T any](r *http.Request) (T, error) {
	defer r.Body.Close()

	body, err := io.ReadAll(r.Body)
	if err != nil {
		return *new(T), err
	}

	var data T
	err = json.Unmarshal(body, &data)
	if err != nil {
		return *new(T), err
	}

	return data, nil
}

func JsonMarshal[T any](w http.ResponseWriter, status int, data T, headers http.Header) error {
	js, err := json.Marshal(data)
	if err != nil {
		return err
	}

	maps.Copy(w.Header(), headers)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	w.Write(js)

	return nil
}
