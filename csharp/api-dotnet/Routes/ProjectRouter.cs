namespace ProjectsBuild.API.Routes;

internal static class ProjectRouter
{
	internal static void MapProjectRoutes(this IEndpointRouteBuilder router)
	{
		var projectRouter = router.MapGroup("/api/v1").WithTags("Projects");

		projectRouter
			.MapGet(
				"/projects",
				() =>
				{
					return TypedResults.Ok(new { Message = "get projects" });
				}
			)
			.WithName("Get Projects")
			.WithSummary("Get Projects")
			.WithDescription("Returns JSON list of Projects. Includes Project Id and Name only");

		projectRouter.MapGet(
			"/projects/{id}",
			[EndpointName("Get Project")]
			[EndpointSummary("Get Project by Id")]
			[EndpointDescription("Returns JSON representation of entire Project if found by Project Id")]
			(string id) => TypedResults.Ok(new { Message = $"get project {id}" })
		);

		projectRouter.MapPost(
			"/projects",
			() =>
			{
				return TypedResults.Created("/projects/<ProjectId>", new { Message = "create project" });
			}
		);

		projectRouter.MapPut(
			"/projects/{id}",
			(string id) => TypedResults.Ok(new { Message = $"updated project {id}" })
		);

		projectRouter.MapDelete(
			"/projects/{id}",
			(string id) => TypedResults.Ok(new { Message = $"delete project {id}" })
		);
	}
}
