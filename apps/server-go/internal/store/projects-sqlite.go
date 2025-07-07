package store

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
	"os"

	"github.com/jmoiron/sqlx"
	"github.com/spfave/projects-build/apps/server-go/internal/core"
	pErr "github.com/spfave/projects-build/apps/server-go/pkg/errors"
	_ "modernc.org/sqlite"
)

// Ref: jmoiron.github.io/sqlx/

var (
	db  *sql.DB
	dbx *sqlx.DB
)

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

	dbx, err = sqlx.Connect("sqlite", dbAddr)
	if err != nil {
		log.Fatal("dbx init - error contacting database: ", err)
	}
	// dbx.Close()

	ProjectSqliteStr.db = db
	ProjectSqliteStr.dbx = dbx
}

type ProjectSqliteStore struct {
	db  *sql.DB
	dbx *sqlx.DB
}

var ProjectSqliteStr = ProjectSqliteStore{db: db}

func (str *ProjectSqliteStore) GetAll() (*[]core.Project, error) {
	// query := "SELECT * FROM pb_projects" // need to scan into all struct fields
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

func (str *ProjectSqliteStore) GetAllX() (*[]core.Project, error) {
	// query := "SELECT * FROM pb_projects" // fails for "audit" columns: created_at, updated_at since not define in Project struct
	query := "SELECT id, name FROM pb_projects"

	var projects []core.Project
	if err := str.dbx.Select(&projects, query); err != nil {
		return nil, fmt.Errorf("project str - error selecting projects: %w", err)
	}

	return &projects, nil
}

func (str *ProjectSqliteStore) GetById(id core.ProjectId) (*core.Project, error) {
	query := `
		SELECT id, name, link, description, notes, status, date_completed, rating, recommend 
		FROM pb_projects 
		WHERE id = $1
	`

	var project core.Project
	err := str.db.QueryRow(query, id).Scan(
		&project.Id, &project.Name, &project.Link,
		&project.Description, &project.Notes, &project.Status,
		&project.DateCompleted, &project.Rating, &project.Recommend,
	)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, pErr.ErrNotFound
		default:
			return nil, fmt.Errorf("project str - error querying project by id: %w", err)
		}
	}

	return &project, nil
}

func (str *ProjectSqliteStore) GetByIdX(id core.ProjectId) (*core.Project, error) {
	query := `
		SELECT id, name, link, description, notes, status, date_completed, rating, recommend 
		FROM pb_projects 
		WHERE id = $1
	`

	var project core.Project
	if err := str.dbx.Get(&project, query, id); err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, pErr.ErrNotFound
		default:
			return nil, fmt.Errorf("project str - error getting project by id: %w", err)
		}
	}

	return &project, nil
}

// func (str *ProjectSqliteStore) Create(project *core.Project) (*core.Project, error) {}

// func (str *ProjectSqliteStore) CreateX(project *core.Project) (*core.Project, error) {}

// func (str *ProjectSqliteStore) Update(id core.ProjectId, project *core.Project) (*core.Project, error) {}

// func (str *ProjectSqliteStore) Delete(id core.ProjectId) (*core.Project, error) {}
