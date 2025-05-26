package api

import (
	"errors"
	"fmt"
	"net/http"

	pErr "github.com/spfave/projects-build/apps/server-go-htmx/pkg/errors"
	pHttp "github.com/spfave/projects-build/apps/server-go-htmx/pkg/http"
)

func apiDemos() *pHttp.Router {
	router := pHttp.NewRouter()
	router.HandleFunc("GET /obj/{id}", getObj)
	router.HandleFunc("POST /obj", postObj)
	router.HandleFunc("GET /auth-basic", authBasic)
	router.HandleFunc("POST /post-form", postForm)
	router.HandleFunc("GET /error-checking", errorChecking)
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
	// b0, _ := pHttp.JsonUnmarshal[any](r)
	// b1, _ := pHttp.JsonUnmarshal[obj](r)
	// b2, _ := pHttp.JsonDecode[obj](r)
	b3, err := pHttp.JsonDecodeStrict[obj](w, r)
	if err != nil {
		switch {
		case errors.Is(err, pErr.ErrNoValue):
			pHttp.RespondJsonError(w, http.StatusBadRequest, pHttp.JSendFail(err.Error(), nil))
		case errors.Is(err, pErr.ErrDataSize):
			pHttp.RespondJsonError(w, http.StatusRequestEntityTooLarge, pHttp.JSendFail(err.Error(), nil))
		case errors.Is(err, pErr.ErrTransform):
			pHttp.RespondJsonError(w, http.StatusUnprocessableEntity, pHttp.JSendFail(err.Error(), nil))
		default:
			pHttp.RespondJsonError(w, http.StatusInternalServerError, pHttp.JSendError(err.Error(), nil, nil))
		}
		return
	}

	fmt.Println()
	// fmt.Printf("b0: %+v\n", b0)
	// fmt.Printf("b1: %+v\n", b1)
	// fmt.Printf("b2: %+v\n", b2)
	fmt.Printf("b3: %+v\n", b3)

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

func authBasic(w http.ResponseWriter, r *http.Request) {
	fmt.Println("\nAUTH BASIC") //LOG
	un, pw, ok := r.BasicAuth()
	if !ok {
		http.Error(w, "Missing credentials", http.StatusBadRequest)
		return
	}

	// validate credentials, if err return http.StatusUnauthorized

	fmt.Printf("credentials: username=%s, password=%s", un, pw) //LOG
	pHttp.RespondJson(w, http.StatusOK, pHttp.Envelope{"username": un, "password": pw}, nil)
}

func postForm(w http.ResponseWriter, r *http.Request) {
	fmt.Println("\nPOST FORM")                                   //LOG
	fmt.Printf("RequestFullUrl: %+v\n", pHttp.RequestFullUrl(r)) //LOG

	fmt.Printf("r.URL.Query(): %+v\n", r.URL.Query()) //LOG
	fmt.Printf("r.Form: %+v\n", r.Form)               //LOG
	fmt.Printf("r.PostForm: %+v\n", r.PostForm)       //LOG

	query := r.URL.Query()
	err := r.ParseForm()
	if err != nil {
		pHttp.RespondJsonError(w, http.StatusBadRequest, pHttp.JSendFail(err.Error(), nil))
		return
	}

	fmt.Println()
	fmt.Printf("query: %+v\n", query)           //LOG
	fmt.Printf("r.Form: %+v\n", r.Form)         //LOG
	fmt.Printf("r.PostForm: %+v\n", r.PostForm) //LOG
	fmt.Println()
	fmt.Printf("query.Get(qpAry): %+v\n", query.Get("qpAry")) //LOG
	fmt.Printf("query[qpAry]: %+v\n", query["qpAry"])         //LOG
	fmt.Printf("query[qp1]: %+v\n", query["qp1"])             //LOG
	fmt.Println()
	fmt.Printf("r.Form.Get(qp1): %+v\n", r.Form.Get("qp1"))         //LOG
	fmt.Printf("r.Form.Get(qpAry): %+v\n", r.Form.Get("qpAry"))     //LOG
	fmt.Printf("r.Form[qpAry]: %+v\n", r.Form["qpAry"])             //LOG
	fmt.Printf("r.Form.Get(title): %+v\n", r.Form.Get("title"))     //LOG
	fmt.Printf("r.Form[content]: %+v\n", r.Form["content"])         //LOG
	fmt.Printf("r.PostForm[content]: %+v\n", r.PostForm["content"]) //LOG
	fmt.Println()
	fmt.Printf("r.FormValue(qp1): %+v\n", r.FormValue("qp1"))     //LOG
	fmt.Printf("r.FormValue(qpAry): %+v\n", r.FormValue("qpAry")) //LOG
	fmt.Printf("r.FormValue(title): %+v\n", r.FormValue("title")) //LOG
	fmt.Println()
	fmt.Printf("r.PostFormValue(qp1): %+v\n", r.PostFormValue("qp1"))         //LOG
	fmt.Printf("r.PostFormValue(content): %+v\n", r.PostFormValue("content")) //LOG

	w.Write([]byte("Done"))
}

func errorChecking(w http.ResponseWriter, r *http.Request) {
	err1 := errors.New("error 1")
	fmt.Println("\nERROR 1")                                                          //LOG
	fmt.Printf("err1: %+v\n", err1)                                                   //LOG: calls .Error() method for string representation
	fmt.Printf("err1.Error(): %+v\n", err1.Error())                                   //LOG
	fmt.Printf("err1 == errors.New(\"error1\"): %+v\n", err1 == errors.New("error1")) //LOG: false

	err2 := ErrSentinel
	fmt.Println("\nERROR 2")                                                        //LOG
	fmt.Printf("err2: %+v\n", err2)                                                 //LOG
	fmt.Printf("err2 == ErrSentinel: %+v\n", err2 == ErrSentinel)                   //LOG: legacy, true
	fmt.Printf("errors.Is(err2, ErrSentinel): %+v\n", errors.Is(err2, ErrSentinel)) //LOG: true

	err3 := fmt.Errorf("error 3: %w", ErrSentinel)
	fmt.Println("\nERROR 3")                                                        //LOG
	fmt.Printf("err3: %+v\n", err3)                                                 //LOG
	fmt.Printf("err3 == ErrSentinel: %+v\n", err3 == ErrSentinel)                   //LOG: false
	fmt.Printf("errors.Is(err3, ErrSentinel): %+v\n", errors.Is(err3, ErrSentinel)) //LOG: true
	fmt.Printf("errors.Unwrap(err3): %+v\n", errors.Unwrap(err3))                   //LOG

	err4 := &pErr.Error{
		Message: "test error 4",
		Cause:   ErrSentinel,
	}
	fmt.Println("\nERROR 4")                                                        //LOG
	fmt.Printf("err4: %+v\n", err4)                                                 //LOG
	fmt.Printf("err4 == &pErr.Error{}: %+v\n", err4 == &pErr.Error{})               //LOG: always false
	fmt.Printf("errors.Is(err4, ErrSentinel): %+v\n", errors.Is(err4, ErrSentinel)) //LOG: true
	var werr *pErr.Error
	fmt.Printf("terr: %+v\n", werr) //LOG
	// fmt.Printf("varName: %+v\n", err4 == err4.(*pErr.Error))                 //LOG
	fmt.Printf("errors.As(err4, &pErr.Error{}): %+v\n", errors.As(err4, &werr)) //LOG: true
	fmt.Printf("errors.Unwrap(err4): %+v\n", errors.Unwrap(err4))               //LOG

	err5 := &pErr.Error{
		Message: "error 5",
		Cause:   errors.Join(err1, err4, errors.ErrUnsupported),
	}
	fmt.Println("\nERROR 5")
	fmt.Printf("err5: %+v\n", err5)                                                                     //LOG
	fmt.Printf("errors.Is(err5, err1): %+v\n", errors.Is(err5, err1))                                   //LOG: true
	fmt.Printf("errors.Is(err5, ErrSentinel): %+v\n", errors.Is(err5, ErrSentinel))                     //LOG: true
	fmt.Printf("errors.Is(err5, errors.ErrUnsupported): %+v\n", errors.Is(err5, errors.ErrUnsupported)) //LOG: true
	var werr2 *pErr.Error
	fmt.Printf("errors.As(err5, &werr2): %+v\n", errors.As(err5, &werr2)) //LOG: true
	fmt.Printf("errors.Unwrap(err5): %+v\n", errors.Unwrap(err5))         //LOG

	// err6 := fmt.Errorf("error 6: %w: %w", ErrSentinel, errors.ErrUnsupported) // doesn't double wrap
	// err6 := fmt.Errorf("error 6: %w", errors.Join(ErrSentinel, errors.ErrUnsupported))
	err6 := &pErr.Error{
		Message: "error 6",
		Cause: &TestError{
			Message: "error 6 cause 1",
			Cause:   ErrSentinel,
		},
	}
	fmt.Println("\nERROR 6")                                                                            //LOG
	fmt.Printf("err6: %+v\n", err6)                                                                     //LOG
	fmt.Printf("errors.Is(err6, errors.ErrUnsupported): %+v\n", errors.Is(err6, errors.ErrUnsupported)) //LOG
	fmt.Printf("errors.Is(err6, ErrSentinel): %+v\n", errors.Is(err6, ErrSentinel))                     //LOG
	var werr3 *TestError
	fmt.Printf("errors.As(err6, &werr2): %+v\n", errors.As(err6, &werr3))        //LOG: true
	fmt.Printf("errors.Unwrap(err6): %+v\n", errors.Unwrap(err6))                //LOG
	fmt.Printf("errors.Unwrap(err6): %+v\n", errors.Unwrap(errors.Unwrap(err6))) //LOG

	pHttp.RespondJson(w, http.StatusOK, "error checking done", nil)
}

var ErrSentinel = errors.New("sentinel error")

type TestError struct {
	Message string
	Cause   error
}

func (err *TestError) Error() string {
	return fmt.Sprintf("%s: %v", err.Message, err.Cause)
}

func (err *TestError) Unwrap() error {
	return err.Cause
}
