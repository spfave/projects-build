package http_pkg

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"maps"
	"math"
	"net/http"

	pErr "github.com/spfave/projects-build/apps/server-go/pkg/errors"
)

// ----------------------------------------------------------------------------------- //
// JSON Response Format

type (
	Envelope        map[string]any
	EnvelopeMessage struct {
		Message string `json:"message"`
	}
)

// Ref: https://github.com/omniti-labs/jsend
type (
	JSendStatus string
	JSend       struct {
		Status  JSendStatus `json:"status"`
		Data    Envelope    `json:"data,omitzero"`
		Message string      `json:"message,omitzero"`
		Code    *int        `json:"code,omitzero"`
	}
)

const (
	JSendStatusSuccess JSendStatus = "success"
	JSendStatusFail    JSendStatus = "fail"
	JSendStatusError   JSendStatus = "error"
)

func JSendSuccess(data Envelope) *JSend {
	return &JSend{
		Status: JSendStatusSuccess,
		Data:   data,
	}
}
func JSendFail(message string, data Envelope) *JSend {
	return &JSend{
		Status:  JSendStatusFail,
		Data:    data,
		Message: message,
	}
}
func JSendError(message string, data Envelope, code *int) *JSend {
	return &JSend{
		Status:  JSendStatusError,
		Data:    data,
		Message: message,
		Code:    code,
	}
}

// ----------------------------------------------------------------------------------- //
// JSON Encoding/Decoding & Marshalling/Unmarshalling
// Ref: https://go.dev/blog/json
// Ref: https://lets-go-further.alexedwards.net/sample/03.02-json-encoding.html

func JsonDecode[T any](r *http.Request) (T, error) {
	if r.Body == nil {
		return *new(T), fmt.Errorf("json decode - request body absent")
	}

	var data T
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		return *new(T), fmt.Errorf("json decode - failed to decode request json body: %w", err)
		// return *new(T), err
	}

	return data, nil
}

func JsonDecodeStrict[T any](w http.ResponseWriter, r *http.Request) (T, error) {
	if r.Body == nil {
		return *new(T), fmt.Errorf("json decode - request body absent: %w", pErr.ErrNoValue)
	}

	maxBytes := int64(math.Pow(2, 20)) // 1MB
	if r.ContentLength > maxBytes {
		return *new(T), fmt.Errorf("json decode - request body too large: %w", pErr.ErrDataSize)
	}

	r.Body = http.MaxBytesReader(w, r.Body, maxBytes)
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	var data T
	if err := decoder.Decode(&data); err != nil {
		return *new(T), fmt.Errorf("json decode - failed to decode request json body: %w", errors.Join(pErr.ErrTransform, err))
	}

	return data, nil
}

func JsonEncode[T any](w http.ResponseWriter, status int, data T) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(data); err != nil {
		return fmt.Errorf("json encode - failed to encode data to json and write response: %w", err)
	}

	return nil
}

func JsonUnmarshal[T any](r *http.Request) (T, error) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		return *new(T), fmt.Errorf("json unmarshal - failed to read request body: %w", err)
	}

	var data T
	err = json.Unmarshal(body, &data)
	if err != nil {
		return *new(T), fmt.Errorf("json unmarshal - failed to unmarshal request json body: %w", err)
	}

	return data, nil
}

func JsonMarshal[T any](w http.ResponseWriter, status int, data T, headers http.Header) error {
	js, err := json.Marshal(data)
	if err != nil {
		return fmt.Errorf("json marshal - failed to marshal data to json: %w", err)
	}

	maps.Copy(w.Header(), headers)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_, err = w.Write(js)
	if err != nil {
		return fmt.Errorf("json marshal - failed to write response: %w", err)
	}

	return nil
}
