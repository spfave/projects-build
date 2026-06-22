package http_pkg

import (
	"fmt"
	"log/slog"
	"net/http"
)

// ----------------------------------------------------------------------------------- //
// Middleware Utils
// Ref: https://www.alexedwards.net/blog/organize-your-go-middleware-without-dependencies

// ----------------------------------------------------------------------------------- //
// Middleware

func CorsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func PanicRecoveryMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			pv := recover()

			if pv != nil {
				w.Header().Set("Connection", "close")
				slog.Error("Panic occurred", slog.String("panic", fmt.Sprint(pv)))
				RespondJsonError(w, http.StatusInternalServerError, JSendError(http.StatusText(http.StatusInternalServerError), Envelope{"panic": pv}, nil))
			}

		}()

		next.ServeHTTP(w, r)
	})
}
