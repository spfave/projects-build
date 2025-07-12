package main

import (
	"fmt"
	"os"
)

// Testing script for now
func main() {
	// ----------------------------------------------------------------------------------- //
	dbSqlite := os.Getenv("DB_FILE_NAME")
	fmt.Printf("dbSqlite: %+v\n", dbSqlite) //LOG

	// ----------------------------------------------------------------------------------- //
	// timeNow := time.Now()
	// timeUTC := timeNow.UTC()
	// fmt.Printf("time: %v\n", timeNow)
	// fmt.Printf("time UTC: %v\n", timeUTC)
	// fmt.Println() //LOG

	// timeParse, err := time.Parse("2006-01-02", "2023-10-01")
	// fmt.Printf("timeParse: %+v\n", timeParse) //LOG
	// fmt.Printf("err: %+v\n", err)             //LOG
	// timeParse2, err := time.Parse("2006-01-02", "2023-1-01")
	// fmt.Printf("timeParse: %+v\n", timeParse2) //LOG
	// fmt.Printf("err2: %+v\n", err)             //LOG
	// timeParse3, err := time.Parse("2006-01-02", "no_date")
	// fmt.Printf("timeParse: %+v\n", timeParse3) //LOG
	// fmt.Printf("err2: %+v\n", err)             //LOG

	// ----------------------------------------------------------------------------------- //
	// tstrN, tstrS := "123", "abc"
	// valN, err := strconv.Atoi(tstrN)
	// if err != nil {
	// 	fmt.Printf("error: %v\n", err)
	// }
	// fmt.Printf("valN: %+v\n", valN)

	// valS, err := strconv.Atoi(tstrS)
	// if err != nil {
	// 	errC := fmt.Errorf("error converting '%s' to int: %w", tstrS, err)
	// 	fmt.Printf("errC: %+v\n", errC)
	// 	fmt.Printf("error: %+v\n", err)
	// }
	// fmt.Printf("valS: %+v\n", valS)
	// fmt.Println() //LOG

	// ----------------------------------------------------------------------------------- //
	// fmt.Printf("rand.Text: %+v\n", rand.Text()[0:8]) //LOG
}
