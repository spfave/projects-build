package store

import (
	"github.com/spfave/projects-build/apps/server-go/internal/core"
)

// Refs
// https://go.dev/doc/database/
// https://www.alexedwards.net/blog/implementing-an-in-memory-cache-in-go
// https://www.alexedwards.net/blog/introduction-to-using-sql-databases-in-go
// https://www.alexedwards.net/blog/organising-database-access
// https://www.alexedwards.net/blog/configuring-sqldb
// https://www.alexedwards.net/blog/how-to-manage-database-timeouts-and-cancellations-in-go
// https://www.youtube.com/watch?v=eE8nqgryW_8

type ProjectRepository interface {
	GetAll() (*[]core.Project, error)
	GetById(id core.ProjectId) (*core.Project, error)
	Create(project *core.Project) (*core.Project, error)
	Update(id core.ProjectId, project *core.Project) (*core.Project, error)
	Delete(id core.ProjectId) (*core.Project, error)
}
