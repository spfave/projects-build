package core

import (
	"regexp"
	"slices"
	"strings"
	"time"

	pErr "github.com/spfave/projects-build/apps/server-go/pkg/errors"
)

// ----------------------------------------------------------------------------------- //
// TYPES
type (
	ProjectId     = string
	ProjectStatus string
	Project       struct {
		Id            ProjectId     `json:"id"`
		Name          string        `json:"name,omitzero"`
		Link          *string       `json:"link,omitzero"`
		Description   *string       `json:"description,omitzero"`
		Notes         *string       `json:"notes,omitzero"`
		Status        ProjectStatus `json:"status,omitzero"`
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

// ----------------------------------------------------------------------------------- //
// CONSTANTS
var PROJECT_STATUSES = [3]ProjectStatus{ProjectStatusBuilding, ProjectStatusPlanning, ProjectStatusComplete}

// ----------------------------------------------------------------------------------- //
// VALIDATION
// Ref: https://github.com/samverrall/request-validation-errors-example
// Ref: https://www.youtube.com/watch?v=J1PDCaJrQG8

var isYMD = regexp.MustCompile(`^\d{4}-\d{2}-\d{2}$`)

type ValidationResult struct {
	Success bool
	Errors  *pErr.ValidationError
}

func ValidateProject(input *ProjectInput) *ValidationResult {
	// var projErrs *pErr.ValidationError // init as nil
	projErrs := &pErr.ValidationError{Entity: make([]string, 0), Fields: make(map[string][]string)}

	// validate input struct
	if input == nil {
		projErrs.Entity = append(projErrs.Entity, "project data is required")
		return &ValidationResult{Success: false, Errors: projErrs}
	}

	// validate fields
	// name
	if strings.TrimSpace(input.Name) == "" {
		projErrs.Fields["name"] = append(projErrs.Fields["name"], "Name is required")
	} else if len(strings.TrimSpace(input.Name)) < 2 {
		projErrs.Fields["name"] = append(projErrs.Fields["name"], "Name must be at least 2 characters")
	} else if len(strings.TrimSpace(input.Name)) > 125 {
		projErrs.Fields["name"] = append(projErrs.Fields["name"], "Name must be less than 125 characters")
	}

	// link
	if input.Link != nil && strings.TrimSpace(*input.Link) == "" {
		projErrs.Fields["link"] = append(projErrs.Fields["link"], "Link must be at least 1 character")
	}

	// description
	if input.Description != nil && strings.TrimSpace(*input.Description) == "" {
		projErrs.Fields["description"] = append(projErrs.Fields["description"], "Description must be at least 1 character")
	}

	// notes
	if input.Notes != nil && strings.TrimSpace(*input.Notes) == "" {
		projErrs.Fields["notes"] = append(projErrs.Fields["notes"], "Notes must be at least 1 character")
	}

	// status
	if strings.TrimSpace(string(input.Status)) == "" {
		projErrs.Fields["status"] = append(projErrs.Fields["status"], "Status is required")
	} else if !slices.Contains(PROJECT_STATUSES[:], input.Status) {
		projErrs.Fields["status"] = append(projErrs.Fields["status"], "Invalid status option")
	}

	// status dependent
	if input.Status == ProjectStatusComplete {
		// dateCompleted
		if input.DateCompleted == nil {
			projErrs.Fields["dateCompleted"] = append(projErrs.Fields["dateCompleted"], "Date completed is required")
		} else if !isYMD.MatchString(*input.DateCompleted) {
			projErrs.Fields["dataCompleted"] = append(projErrs.Fields["dataCompleted"], "Invalid format. Use YYYY-MM-DD")
		} else if date, err := time.Parse("2006-01-02", *input.DateCompleted); err != nil || date.IsZero() {
			projErrs.Fields["dateCompleted"] = append(projErrs.Fields["dateCompleted"], "Invalid date")
		} else if date.After(time.Now()) {
			projErrs.Fields["dateCompleted"] = append(projErrs.Fields["dateCompleted"], "Invalid date: cannot be in the future")
		}

		// rating
		if input.Rating == nil {
			projErrs.Fields["rating"] = append(projErrs.Fields["rating"], "Rating is required")
		} else if *input.Rating < 1 || *input.Rating > 5 {
			projErrs.Fields["rating"] = append(projErrs.Fields["rating"], "Rating must be a whole number 1 through 5")
		}

		// recommend
		if input.Recommend == nil {
			projErrs.Fields["recommend"] = append(projErrs.Fields["recommend"], "Recommend is required")
		}

	} else {
		if input.DateCompleted != nil {
			projErrs.Fields["dateCompleted"] = append(projErrs.Fields["dateCompleted"], "Date completed is not allowed")
		}
		if input.Rating != nil {
			projErrs.Fields["rating"] = append(projErrs.Fields["rating"], "Rating is not allowed")
		}
		if input.Recommend != nil {
			projErrs.Fields["recommend"] = append(projErrs.Fields["recommend"], "Recommend is not allowed")
		}
	}

	if projErrs.HasErrors() {
		return &ValidationResult{Success: false, Errors: projErrs}
	}
	return &ValidationResult{Success: true, Errors: nil}
}

func TransformProject(p *ProjectInput) *ProjectInput {
	project := &ProjectInput{
		Name:   strings.TrimSpace(p.Name),
		Status: p.Status,
	}

	if p.Link != nil {
		trimmedLink := strings.TrimSpace(*p.Link)
		project.Link = &trimmedLink
	}
	if p.Description != nil {
		trimmedDescription := strings.TrimSpace(*p.Description)
		project.Description = &trimmedDescription
	}
	if p.Notes != nil {
		trimmedNotes := strings.TrimSpace(*p.Notes)
		project.Notes = &trimmedNotes
	}

	if p.Status == ProjectStatusComplete {
		project.DateCompleted = p.DateCompleted
		project.Rating = p.Rating
		project.Recommend = p.Recommend
	}

	return project
}
