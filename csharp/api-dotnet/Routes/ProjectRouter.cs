using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using ProjectsBuild.API.Project;

namespace ProjectsBuild.API.Routes;

internal static class ProjectRouter
{
	internal static void MapProjectRoutes(this IEndpointRouteBuilder router)
	{
		var projectRouter = router.MapGroup("/api/v1/projects").WithTags("Projects");

		projectRouter
			.MapGet("/", GetProjects)
			.WithName("Get Projects")
			.WithSummary("Get Projects")
			.WithDescription("Returns JSON list of Projects. Includes Project Id and Name only");

		projectRouter
			.MapGet("/{id}", GetProjectById)
			.WithName("Get Project by Id")
			.WithSummary("Get Project by Id")
			.WithDescription("Returns JSON representation of Project if found by Project Id");

		projectRouter
			.MapPost("/", CreateProject)
			.WithName("Create Project")
			.WithSummary("Create Project")
			.WithDescription("Creates a new Project. Returns JSON representation of created Project");

		projectRouter
			.MapPut("/{id}", UpdateProject)
			.WithName("Update Project")
			.WithSummary("Update Project")
			.WithDescription(
				"Updates Project if found by Id. Returns JSON representation of updated Project otherwise not-found"
			);

		projectRouter
			.MapDelete("/{id}", DeleteProject)
			.WithName("Delete Project")
			.WithSummary("Delete Project")
			.WithDescription(
				"Deletes Project if found by Id. Returns JSON representation of deleted Project otherwise not-found"
			);

		projectRouter.MapPost(
			"/proj-req",
			(ProjectRequest proj) =>
			{
				Console.WriteLine($"proj: {proj}"); // LOG DEBUG
				Console.WriteLine($"proj.Status: {proj.Status}"); // LOG DEBUG
				return TypedResults.Created("/proj-req", proj);
			}
		);
	}

	private static readonly List<Project.Project> _projects =
	[
		new()
		{
			Id = RandomString(),
			Name = "Proj 1",
			Link = "https://example.com/proj1",
			Description = "Project 1 description",
			Status = ProjectStatus.Planning,
		},
		new()
		{
			Id = RandomString(),
			Name = "Proj 2",
			Status = ProjectStatus.Building,
		},
	];

	private static string RandomString(int length = 8)
	{
		return Guid.NewGuid().ToString("N")[..length]; // Note: "N" format specifier returns 32 digits without hyphens. e.g. "d85b1407351d469493920c7f6a0e3b8d"
	}

	private static async Task<Ok<IReadOnlyList<Project.Project>>> GetProjects()
	{
		IReadOnlyList<Project.Project> projects = _projects.AsReadOnly();
		return TypedResults.Ok(projects);
	}

	private static async Task<Results<Ok<Project.Project>, ProblemHttpResult>> GetProjectById(
		string id
	)
	{
		var project = _projects.FirstOrDefault(p => p.Id == id);
		return project is not null
			? TypedResults.Ok(project)
			: TypedResults.Problem(
				statusCode: StatusCodes.Status404NotFound,
				detail: "Project not found"
			);
	}

	private static async Task<Created<Project.Project>> CreateProject(ProjectRequest payload)
	{
		var project = new Project.Project
		{
			Id = RandomString(),
			Name = payload.Name,
			Status = payload.Status,
		};
		_projects.Add(project);
		return TypedResults.Created($"/projects/{project.Id}", project);
	}

	private static async Task<Results<Ok<Project.Project>, ProblemHttpResult>> UpdateProject(
		string id,
		ProjectRequest payload
	)
	{
		var project = _projects.FirstOrDefault(p => p.Id == id);
		if (project is null)
			return TypedResults.Problem(
				statusCode: StatusCodes.Status404NotFound,
				detail: "Project not found"
			);

		project.Name = payload.Name;

		return TypedResults.Ok(project);
	}

	// private static async Task<Results<NoContent, NotFound>> DeleteProject(string id)
	// private static async Task<Results<NoContent, NotFound<string>>> DeleteProject(string id)
	// private static async Task<Results<NoContent, ProblemHttpResult>> DeleteProject(string id)
	private static async Task<Results<NoContent, NotFound<ProblemDetails>>> DeleteProject(string id)
	{
		var count = _projects.RemoveAll(p => p.Id == id);
		// return count > 0 ? TypedResults.NoContent() : TypedResults.NotFound(); // OpenAPI 404 res inferred, ProblemDetails content but not customized
		// return count > 0 ? TypedResults.NoContent() : TypedResults.NotFound("Project not found"); // OpenAPI 404 res inferred, customized content but not ProblemDetails shape
		// return count > 0
		// 	? TypedResults.NoContent()
		// 	: TypedResults.Problem(
		// 		statusCode: StatusCodes.Status404NotFound,
		// 		detail: "Project not found"
		// 	); // OpenAPI 404 res not inferred, ProblemDetails content and customizable
		return count > 0
			? TypedResults.NoContent()
			: TypedResults.NotFound(new ProblemDetails { Detail = $"Project with Id: {id} not found" }); // OpenAPI 404 res inferred, ProblemDetails content and customizable
	}
}
