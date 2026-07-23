namespace ProjectsBuild.API.Routes;

internal static class ProjectRouter
{
	internal static void MapProjectRoutes(this IEndpointRouteBuilder router)
	{
		var projectRouter = router.MapGroup("/api/v1/projects").WithTags("Projects");

		projectRouter
			.MapGet(
				"/",
				async () =>
				{
					return TypedResults.Ok(new { Message = "get projects" });
				}
			)
			.WithName("Get Projects")
			.WithSummary("Get Projects")
			.WithDescription("Returns JSON list of Projects. Includes Project Id and Name only");

		projectRouter.MapGet(
			"/{id}",
			[EndpointName("Get Project")]
			[EndpointSummary("Get Project by Id")]
			[EndpointDescription("Returns JSON representation of Project if found by Project Id")]
			async (string id) => TypedResults.Ok(new { Message = $"get project {id}" })
		);

		projectRouter
			.MapPost(
				"/",
				async () =>
				{
					return TypedResults.Created("/<ProjectId>", new { Message = "create project" });
				}
			)
			.WithName("Create Project")
			.WithSummary("Create Project")
			.WithDescription("Creates a new Project. Returns JSON representation of created Project");

		projectRouter
			.MapPut(
				"/{id}",
				async (string id) => TypedResults.Ok(new { Message = $"updated project {id}" })
			)
			.WithName("Update Project")
			.WithSummary("Update Project")
			.WithDescription(
				"Updates Project if found by Id. Returns JSON representation of updated Project otherwise not-found"
			);

		projectRouter
			.MapDelete(
				"/{id}",
				async (string id) => TypedResults.Ok(new { Message = $"delete project {id}" })
			)
			.WithName("Delete Project")
			.WithSummary("Delete Project")
			.WithDescription(
				"Deletes Project if found by Id. Returns JSON representation of deleted Project otherwise not-found"
			);
	}
}
