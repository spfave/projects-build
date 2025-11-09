package store

import (
	"crypto/rand"
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

// Ref: https://go.dev/doc/database/querying
// Ref: https://go.dev/doc/database/change-data
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

var ProjectSqliteStr = ProjectSqliteStore{db: db, dbx: dbx}

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
	// query := "SELECT * FROM pb_projects" // fails for "audit" columns: created_at, updated_at since not define in core.Project struct
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

// Insert and return new project with separate execute and query statements
func (str *ProjectSqliteStore) Create(input *core.ProjectInput) (*core.Project, error) {
	projectId := rand.Text()[0:8]
	query := `
		INSERT INTO pb_projects (id, name, link, description, notes, status, date_completed, rating, recommend)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
	`

	result, err := str.db.Exec(
		query,
		projectId, input.Name, input.Link,
		input.Description, input.Notes, input.Status,
		input.DateCompleted, input.Rating, input.Recommend,
	)
	if err != nil {
		return nil, fmt.Errorf("project str - error inserting new project: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return nil, fmt.Errorf("project str - error getting rows affected: %w", err)
	}
	if rowsAffected == 0 {
		return nil, fmt.Errorf("project str - no rows affected, project not created")
	}

	return str.GetById(projectId)
}

// Insert and return new project with single 'returning' statement, simplified with sqlx
func (str *ProjectSqliteStore) CreateX(input *core.ProjectInput) (*core.Project, error) {
	projectId := rand.Text()[0:8]
	query := `
		INSERT INTO pb_projects (id, name, link, description, notes, status, date_completed, rating, recommend)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING id, name, link, description, notes, status, date_completed, rating, recommend
	`

	var project core.Project
	if err := str.dbx.Get(
		&project, query,
		projectId, input.Name, input.Link,
		input.Description, input.Notes, input.Status,
		input.DateCompleted, input.Rating, input.Recommend,
	); err != nil {
		return nil, fmt.Errorf("project str - error inserting new project: %w", err)
	}

	return &project, nil
}

// Update and return new project with separate execute and query statements
func (str *ProjectSqliteStore) Update(id core.ProjectId, project *core.ProjectInput) (*core.Project, error) {
	query := `
		UPDATE pb_projects 
		SET name = $1, link = $2, description = $3, notes = $4, status = $5, date_completed = $6, rating = $7, recommend = $8
		WHERE id = $9
	`

	result, err := str.db.Exec(
		query,
		project.Name, project.Link,
		project.Description, project.Notes, project.Status,
		project.DateCompleted, project.Rating, project.Recommend, id,
	)
	if err != nil {
		return nil, fmt.Errorf("project str - error updating project: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return nil, fmt.Errorf("project str - error getting rows affected: %w", err)
	}
	if rowsAffected == 0 {
		return nil, pErr.ErrNotFound
	}

	return str.GetById(id)
}

// Update and return new project with single 'returning' statement, simplified with sqlx
func (str *ProjectSqliteStore) UpdateX(id core.ProjectId, project *core.ProjectInput) (*core.Project, error) {
	query := `
		UPDATE pb_projects 
		SET name = $1, link = $2, description = $3, notes = $4, status = $5, date_completed = $6, rating = $7, recommend = $8
		WHERE id = $9
		RETURNING id, name, link, description, notes, status, date_completed, rating, recommend
	`

	var updatedProject core.Project
	if err := str.dbx.Get(
		&updatedProject,
		query,
		project.Name, project.Link,
		project.Description, project.Notes, project.Status,
		project.DateCompleted, project.Rating, project.Recommend, id,
	); err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, pErr.ErrNotFound
		default:
			return nil, fmt.Errorf("project str - error updating project: %w", err)
		}
	}

	return &updatedProject, nil
}

// Delete with execution, sql default returns number of rows affected
func (str *ProjectSqliteStore) DeleteNR(id core.ProjectId) (*core.Project, error) {
	query := "DELETE FROM pb_projects WHERE id = $1"

	result, err := str.db.Exec(query, id)
	if err != nil {
		return nil, fmt.Errorf("project str - error deleting project: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return nil, fmt.Errorf("project str - error getting rows affected: %w", err)
	}
	if rowsAffected == 0 {
		return nil, pErr.ErrNotFound
	}

	return &core.Project{Id: id}, nil // Return project with Id only
}

// Delete and return project with separate query and execute statements
func (str *ProjectSqliteStore) Delete(id core.ProjectId) (*core.Project, error) {
	project, err := str.GetById(id) // Get the project first to return it after deletion
	if err != nil {
		return nil, err
	}

	_, err = str.DeleteNR(id) // Delete project, ignore incomplete returned project
	if err != nil {
		return nil, err
	}

	return project, nil
}

// Delete and return project with single 'returning' query, simplified with sqlx
func (str *ProjectSqliteStore) DeleteX(id core.ProjectId) (*core.Project, error) {
	query := `
		DELETE FROM pb_projects 
		WHERE id = $1
		RETURNING id, name, link, description, notes, status, date_completed, rating, recommend
	`

	var project core.Project
	if err := str.dbx.Get(&project, query, id); err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, pErr.ErrNotFound
		default:
			return nil, fmt.Errorf("project str - error deleting project: %w", err)
		}
	}

	return &project, nil
}
