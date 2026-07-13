using ProjectsBuild.API.Routes;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddOpenApi(
	"projects-build",
	(options) =>
	{
		options.AddDocumentTransformer(
			(document, context, ct) =>
			{
				document.Info.Title = "Projects.build | API-dotnet";
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
	app.MapScalarApiReference(
		"/openapi/scalar/",
		(options) =>
		{
			options
				.WithTheme(ScalarTheme.Purple)
				.WithClassicLayout()
				.ShowOperationId()
				.WithDefaultHttpClient(ScalarTarget.JavaScript, ScalarClient.Fetch);
		}
	);
}

app.MapProjectRoutes();

app.Run();
