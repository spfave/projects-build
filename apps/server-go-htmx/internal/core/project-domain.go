package core

// ----------------------------------------------------------------------------------- //
// TYPES
type (
	ProjectStatus string
	Project       struct {
		Id            string        `json:"id"`
		Name          string        `json:"name"`
		Link          *string       `json:"link,omitzero"`
		Description   *string       `json:"description,omitzero"`
		Notes         *string       `json:"notes,omitzero"`
		Status        ProjectStatus `json:"status"`
		DateCompleted *string       `json:"dateCompleted,omitzero"`
		Rating        *int          `json:"rating,omitzero"`
		Recommend     *bool         `json:"recommend,omitzero"`
	}
	ProjectInput struct {
		Name          string        `json:"name"`
		Link          *string       `json:"link,omitzero"`
		Description   *string       `json:"description,omitzero"`
		Notes         *string       `json:"notes,omitzero"`
		Status        ProjectStatus `json:"status"`
		DateCompleted *string       `json:"dateCompleted,omitzero"`
		Rating        *int          `json:"rating,omitzero"`
		Recommend     *bool         `json:"recommend,omitzero"`
	}
)

const (
	ProjectStatusPlanning ProjectStatus = "planning"
	ProjectStatusBuilding ProjectStatus = "building"
	ProjectStatusComplete ProjectStatus = "complete"
)
