using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpLogging;
using Microsoft.AspNetCore.Mvc;
using ProjectsBuild.API.Common;
using ProjectsBuild.API.Routes;
using Scalar.AspNetCore;

// Add and configure services
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails(
	(options) =>
	{
		options.CustomizeProblemDetails = (context) =>
		{
			var http = context.HttpContext;
			context.ProblemDetails.Instance = $"{http.Request.Method} {http.Request.GetDisplayUrl()}";
			context.ProblemDetails.Extensions.TryAdd("requestId", http.TraceIdentifier);
			context.ProblemDetails.Extensions.TryAdd(
				"traceId",
				http.Features.Get<IHttpActivityFeature>()?.Activity?.Id
			);
		};
	}
);
builder.Services.AddHttpLogging(
	(options) =>
	{
		options.LoggingFields =
			HttpLoggingFields.RequestProperties
			| HttpLoggingFields.RequestQuery
			| HttpLoggingFields.ResponseStatusCode
			| HttpLoggingFields.Duration;
		options.CombineLogs = true;
	}
);
builder.Services.AddHealthChecks();
builder.Services.AddValidation();
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

app.UseExceptionHandler();
if (app.Environment.IsDevelopment())
{
	app.UseHttpLogging();
	app.UseStatusCodePages();
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
		TypedResults.Problem(
			new ProblemDetails
			{
				Status = StatusCodes.Status404NotFound,
				Title = "Not Found",
				Detail = "The requested resource was not found.",
			}
		)
);
app.MapDemoRoutes();
app.MapProjectRoutes();

// Run application
app.Logger.LogInformation("Run application");
app.Run();
