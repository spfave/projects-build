namespace ProjectsBuild.API.Routes;

internal static class ProjectsRouter
{
	internal static void MapProjectRoutes(this IEndpointRouteBuilder router)
	{
		var projectsRouter = router.MapGroup("/api/v1").WithTags("Projects");

		projectsRouter
			.MapGet(
				"/projects",
				() =>
				{
					return TypedResults.Ok(new { Message = "get projects!!" });
				}
			)
			.WithName("Get Projects")
			.WithSummary("Get Projects")
			.WithDescription("Returns JSON list of Projects. Includes Project Id and Name only");

		projectsRouter.MapGet(
			"/projects/{id}",
			[EndpointName("Get Project")]
			[EndpointSummary("Get Project by Id")]
			[EndpointDescription("Returns JSON representation of entire Project if found by Project Id")]
			(string id) => TypedResults.Ok(new { Message = $"get project {id}" })
		);

		projectsRouter.MapPost(
			"/projects",
			() =>
			{
				return TypedResults.Created("/projects/<ProjectId>", new { Message = "create project" });
			}
		);

		projectsRouter.MapPut(
			"/projects/{id}",
			(string id) => TypedResults.Ok(new { Message = $"updated project {id}" })
		);

		projectsRouter.MapDelete(
			"/projects/{id}",
			(string id) => TypedResults.Ok(new { Message = $"delete project {id}" })
		);
	}
}
