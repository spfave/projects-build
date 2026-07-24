using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http.HttpResults;

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
	}

	private static readonly List<Project> _projects =
	[
		new() { Id = RandomString(), Name = "Proj 1" },
		new() { Id = RandomString(), Name = "Proj 2" },
	];

	private static string RandomString(int length = 8)
	{
		string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		return new Random().GetString(chars, length);
	}

	private static async Task<Ok<IReadOnlyList<Project>>> GetProjects()
	{
		IReadOnlyList<Project> projects = _projects.AsReadOnly();
		return TypedResults.Ok(projects);
	}

	private static async Task<Results<Ok<Project>, ProblemHttpResult>> GetProjectById(string id)
	{
		var project = _projects.FirstOrDefault(p => p.Id == id);
		return project is not null
			? TypedResults.Ok(project)
			: TypedResults.Problem(
				statusCode: StatusCodes.Status404NotFound,
				detail: "Project not found"
			);
	}

	private static async Task<Created<Project>> CreateProject(ProjectRequest payload)
	{
		var project = new Project { Id = RandomString(), Name = payload.Name };
		_projects.Add(project);
		return TypedResults.Created($"/projects/{project.Id}", project);
	}

	private static async Task<Results<Ok<Project>, ProblemHttpResult>> UpdateProject(
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

	private static async Task<Results<NoContent, ProblemHttpResult>> DeleteProject(string id)
	{
		var count = _projects.RemoveAll(p => p.Id == id);
		// return count > 0 ? TypedResults.NoContent() : TypedResults.NotFound("Project not found");
		return count > 0
			? TypedResults.NoContent()
			: TypedResults.Problem(
				statusCode: StatusCodes.Status404NotFound,
				detail: "Project not found"
			);
	}
}

public sealed class Project
{
	public string Id { get; init; }
	public required string Name { get; set; }
}

public sealed record ProjectRequest([Required] string Name);
