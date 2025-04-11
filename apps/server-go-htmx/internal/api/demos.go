package api

import (
	"fmt"
	"net/http"

	pHttp "github.com/spfave/projects-build/apps/server-go-htmx/pkg/http_utils"
)

func apiDemos() *pHttp.Router {
	router := pHttp.NewRouter()
	router.HandleFunc("GET /obj/{id}", getObj)
	router.HandleFunc("POST /obj", postObj)
	router.HandleFunc("/error", pHttp.HandlerError)
	router.HandleNotFound()

	return router
}

type obj struct {
	Id      int     `json:"id"`
	Title   string  `json:"title"`
	Content *string `json:"content"`
	Link    *string `json:"link,omitzero"`
	Checked bool    `json:"checked"`
	Val1    int     `json:"val1"`
	Val2    *int    `json:"val2"`
	Val3    int     `json:"val3,omitzero"`
	Val4    *int    `json:"val4,omitzero"`
}

func getObj(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	p2 := r.PathValue("p2")
	fmt.Println()
	fmt.Printf("id: %+v\n", id)
	fmt.Printf("p2: %+v\n", p2)

	pHttp.JsonEncode(w, http.StatusOK, obj{}) // returns obj struct with 'zero' values
}

func postObj(w http.ResponseWriter, r *http.Request) {
	// only first reads from r.Body successfully
	b0, _ := pHttp.JsonUnmarshal[any](r)
	b1, _ := pHttp.JsonUnmarshal[obj](r)
	b2, _ := pHttp.JsonDecode[obj](r)

	fmt.Println()
	fmt.Printf("b0: %+v\n", b0)
	fmt.Printf("b1: %+v\n", b1)
	fmt.Printf("b2: %+v\n", b2)

	// body, _ := io.ReadAll(r.Body)
	// log struct fields using reflection
	// val := reflect.ValueOf(r.Body) // does not work
	// for i := range val.Type().NumField() {
	// 	field := val.Type().Field(i)
	// 	value := val.Field(i)
	// 	fmt.Printf("Key: %s, Value: %v\n", field.Name, value.Interface())
	// }

	w.Write([]byte("Done"))
}
