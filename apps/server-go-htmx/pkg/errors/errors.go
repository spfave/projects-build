package errors_pkg

import (
	"errors"
	"fmt"
)

// Ref: https://go.dev/blog/error-handling-and-go
// Ref: https://go.dev/blog/errors-are-values
// Ref: https://go.dev/blog/go1.13-errors
// Ref: https://dave.cheney.net/2016/04/27/dont-just-check-errors-handle-them-gracefully
// Ref: https://stackoverflow.com/questions/72307412/applying-errors-is-and-errors-as-on-custom-made-struct-errors
// Ref: https://stackoverflow.com/questions/23796543/go-checking-for-the-type-of-a-custom-error/76188067#76188067

// Ref: https://www.youtube.com/watch?v=aS1cJfQ-LrQ
// Ref: https://www.youtube.com/watch?v=dKUiCF3abHc

// ----------------------------------------------------------------------------------- //
// SENTINEL ERRORS

var (
	ErrNoValue   = errors.New("no value")
	ErrDataSize  = errors.New("maximum data size exceeded")
	ErrTransform = errors.New("data transform failed")
)

// ----------------------------------------------------------------------------------- //
// CUSTOM ERRORS

type Error struct {
	Message string
	Cause   error
	// Code    int
	Context map[string]any
}

func (err *Error) Error() string {
	// return err.Message
	return fmt.Sprintf("%s: %v", err.Message, err.Cause)
}

func (err *Error) Unwrap() error {
	return err.Cause
}

// type ValidationError struct {
// 	Entity []string
// 	Fields map[string][]string
// }
