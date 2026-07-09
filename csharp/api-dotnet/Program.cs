using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddOpenApi(
	"projects-build",
	(options) =>
	{
		options.AddDocumentTransformer(
			(document, context, ct) =>
			{
				document.Info.Title = "Projects.build | api-dotnet";
				document.Info.Summary = "API to manage project builds";
				document.Info.Description =
					"JSON API to manage and track project builds. Built with C# and ASP.NET";
				return Task.CompletedTask;
			}
		);
	}
);

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
	app.MapOpenApi();
	app.MapScalarApiReference("/openapi/scalar/");
}

var projectsGroup = app.MapGroup("/api/v1").WithTags("Projects");

projectsGroup
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

projectsGroup.MapGet(
	"/projects/{id}",
	[EndpointName("Get Project")]
	[EndpointSummary("Get Project by Id")]
	[EndpointDescription("Returns JSON representation of entire Project if found by Project Id")]
	(string id) => TypedResults.Ok(new { Message = $"get project {id}" })
);

projectsGroup.MapPost(
	"/projects",
	() =>
	{
		return TypedResults.Created("/projects/<ProjectId>", new { Message = "create project" });
	}
);

projectsGroup.MapPut(
	"/projects/{id}",
	(string id) => TypedResults.Ok(new { Message = $"updated project {id}" })
);

projectsGroup.MapDelete(
	"/projects/{id}",
	(string id) => TypedResults.Ok(new { Message = $"delete project {id}" })
);

app.Run();
