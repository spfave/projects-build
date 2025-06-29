package store

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/spfave/projects-build/apps/server-go/internal/core"
	_ "modernc.org/sqlite"
)

var db *sql.DB

func init() {
	dbAddr, ok := os.LookupEnv("DB_FILE_NAME")
	if !ok {
		log.Fatal("db init - environment variable not set")
	}

	var err error
	db, err = sql.Open("sqlite", dbAddr)
	if err != nil {
		log.Fatal("db init - error opening database: ", err)
	}
	// defer db.Close()

	err = db.Ping()
	if err != nil {
		log.Fatal("db init - error pinging database: ", err)
	}

	ProjectSqliteStr.db = db
}

type ProjectSqliteStore struct {
	db *sql.DB
}

var ProjectSqliteStr = ProjectSqliteStore{db: db}

func (str *ProjectSqliteStore) GetAll() (*[]core.Project, error) {
	query := "SELECT id, name FROM pb_projects"

	rows, err := str.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("project str - error querying projects: %w", err)
	}
	defer rows.Close()

	var projects []core.Project
	for rows.Next() {
		var project core.Project
		if err := rows.Scan(&project.Id, &project.Name); err != nil {
			return nil, fmt.Errorf("project str - error scanning project row: %w", err)
		}
		projects = append(projects, project)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("project str - error iterating over project rows: %w", err)
	}

	return &projects, nil
}

// func (str *ProjectSqliteStore) GetAll() (*[]core.Project, error) {}

// func (str *ProjectSqliteStore) GetById(id core.ProjectId) (*core.Project, error) {}

// func (str *ProjectSqliteStore) Create(project *core.Project) (*core.Project, error) {}

// func (str *ProjectSqliteStore) Update(id core.ProjectId, project *core.Project) (*core.Project, error) {}

// func (str *ProjectSqliteStore) Delete(id core.ProjectId) (*core.Project, error) {}
