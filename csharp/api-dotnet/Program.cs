using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddOpenApi("projects-build", (options) =>
{
	options.AddDocumentTransformer((document, context, ct) =>
	{
		document.Info.Title = "Projects.build | api-dotnet";
		document.Info.Summary = "API to manage project builds";
		document.Info.Description = "JSON API to manage and track project builds. Built with C# and ASP.NET";
		return Task.CompletedTask;
	});
});


var app = builder.Build();
if (app.Environment.IsDevelopment())
{
	app.MapOpenApi();
	app.MapScalarApiReference("/openapi/scalar/");
}

app.MapGet("/", () => "Hello World!");

app.MapGet("/projects", () => "get projects")
	.WithName("Get Projects")
	.WithDisplayName("Get Projects list")
	.WithSummary("Get Projects list")
	.WithDescription("Returns JSON list of Projects. Includes Project Id and Name only")
	.WithTags("Projects");
app.MapGet("/projects/{id}",
[EndpointName("Get Project")]
[EndpointSummary("Get Project by Id")]
[EndpointDescription("Returns JSON representation of entire Project if found by Project Id")]
[Tags("Projects")]
(string id) => $"get project {id}"
);
app.MapPost("/projects", () => "create project");
app.MapPut("/projects/{id}", (string id) => $"updated project {id}");



app.MapDelete("/projects/{id}", (string id) => $"delete project {id}");

app.Run();
