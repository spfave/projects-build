using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.HttpLogging;
using ProjectsBuild.API.Routes;
using Scalar.AspNetCore;

// Add and configure services
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHealthChecks();
builder.Services.AddHttpLogging(
	(logging) =>
	{
		logging.LoggingFields =
			HttpLoggingFields.RequestProperties
			| HttpLoggingFields.RequestQuery
			| HttpLoggingFields.ResponseStatusCode
			| HttpLoggingFields.Duration;
		logging.CombineLogs = true;
	}
);
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

// Build and configure application
var app = builder.Build();
if (app.Environment.IsDevelopment())
{
	app.UseHttpLogging();
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

app.MapHealthChecks("/health-check");
app.MapFallback(
	(HttpContext context) =>
		TypedResults.NotFound(new { message = $"not found - {context.Request.GetDisplayUrl()}" })
);
app.MapDemoRoutes();
app.MapProjectRoutes();

// Run application
app.Logger.LogInformation("Run application");
app.Run();
