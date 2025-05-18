package store

import (
	"fmt"

	"github.com/spfave/projects-build/apps/server-go-htmx/internal/core"
)

// Ref: https://www.alexedwards.net/blog/implementing-an-in-memory-cache-in-go
// Ref: https://www.alexedwards.net/blog/organising-database-access

type ProjectRepository interface {
	GetAll() (*[]core.Project, error)
	GetById(id string) (*core.Project, error)
	Create(project *core.Project) (*core.Project, error)
	UpdateById(id string, project *core.Project) (*core.Project, error)
	Delete(id string) (*core.Project, error)
}

// ----------------------------------------------------------------------------------- //
// IN-MEMORY STORE

type ProjectMemoryStore struct {
	projects map[string]core.Project
}

var (
	// ProjectMemStr = ProjectMemoryStore{} // init'd with nil "projects" map, write op will panic
	ProjectMemStr = ProjectMemoryStore{projects: make(map[string]core.Project, 10)} // init'd with defined "projects" map
	// ProjectMemStr = ProjectMemoryStore{ // init'd with defined "projects" map
	// 	projects: map[string]core.Project{
	// 		"io3q487p": {
	// 			Id:     rand.Text()[0:8],
	// 			Name:   "Project 1",
	// 			Status: core.ProjectStatusPlanning,
	// 		},
	// 		"ok3mbep4": {
	// 			Id:     rand.Text()[0:8],
	// 			Name:   "Project 2",
	// 			Status: core.ProjectStatusBuilding,
	// 		},
	// 	},
	// }

	// projectMap map[string]core.Project // init'd as nil "projects" map, write op will panic
	projectMap = make(map[string]core.Project, 10)
)

// note: working with global ProjectMemStr struct variable
func (str *ProjectMemoryStore) GetAll() (*[]core.Project, error) {
	// return nil, fmt.Errorf("projectMemoryStore.GetAll() error")

	fmt.Printf("str.projects: %+v\n", str.projects) //LOG
	projects := make([]core.Project, 0, len(str.projects))
	for _, project := range str.projects {
		projects = append(projects, project)
	}
	return &projects, nil
}

// note: working with package "global" projectStore map variable
// func GetAll() (*[]core.Project, error) {
// 	fmt.Printf("projectMap: %+v\n", projectMap) //LOG
// 	projects := make([]core.Project, 0, len(projectMap))
// 	for _, project := range projectMap {
// 		projects = append(projects, project)
// 	}
// 	return &projects, nil
// }
