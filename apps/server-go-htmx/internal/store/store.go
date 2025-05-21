package store

import (
	"crypto/rand"

	"github.com/spfave/projects-build/apps/server-go-htmx/internal/core"
	pErr "github.com/spfave/projects-build/apps/server-go-htmx/pkg/errors"
)

// Ref: https://www.alexedwards.net/blog/implementing-an-in-memory-cache-in-go
// Ref: https://www.alexedwards.net/blog/organising-database-access

type ProjectRepository interface {
	GetAll() (*[]core.Project, error)
	GetById(id string) (*core.Project, error)
	Create(project *core.Project) (*core.Project, error)
	Update(id string, project *core.Project) (*core.Project, error)
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
	// 			Id:     "io3q487p",
	// 			Name:   "Project 1",
	// 			Status: core.ProjectStatusPlanning,
	// 		},
	// 		"ok3mbep4": {
	// 			Id:     "ok3mbep4",
	// 			Name:   "Project 2",
	// 			Status: core.ProjectStatusBuilding,
	// 		},
	// 	},
	// }

	// projectMap map[string]core.Project // init'd as nil "projects" map, write op will panic
	// projectMap = make(map[string]core.Project, 10)
)

// note: working with global ProjectMemStr struct variable
func (str *ProjectMemoryStore) GetAll() (*[]core.Project, error) {
	// return nil, fmt.Errorf("projectMemoryStore.GetAll() error")

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

func (str *ProjectMemoryStore) GetById(projectId string) (*core.Project, error) {
	project, ok := str.projects[projectId]
	if !ok {
		return nil, pErr.ErrNotFound
	}
	return &project, nil
}

func (str *ProjectMemoryStore) Create(input *core.ProjectInput) (*core.Project, error) {
	project := core.Project{
		Id:            rand.Text()[0:8],
		Name:          input.Name,
		Link:          input.Link,
		Description:   input.Description,
		Notes:         input.Notes,
		Status:        input.Status,
		DateCompleted: input.DateCompleted,
		Rating:        input.Rating,
		Recommend:     input.Recommend,
	}
	str.projects[project.Id] = project
	return &project, nil
}

func (str *ProjectMemoryStore) Update(id string, input *core.ProjectInput) (*core.Project, error) {
	project, ok := str.projects[id]
	if !ok {
		return nil, pErr.ErrNotFound
	}

	project.Name = input.Name
	project.Link = input.Link
	project.Description = input.Description
	project.Notes = input.Notes
	project.Status = input.Status
	project.DateCompleted = input.DateCompleted
	project.Rating = input.Rating
	project.Recommend = input.Recommend

	str.projects[id] = project
	return &project, nil
}

func (str *ProjectMemoryStore) Delete(projectId string) (*core.Project, error) {
	project, ok := str.projects[projectId]
	if !ok {
		return nil, pErr.ErrNotFound
	}
	delete(str.projects, projectId)
	return &project, nil

}
