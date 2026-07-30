using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpLogging;
using Microsoft.AspNetCore.Mvc;
using ProjectsBuild.API.Common;
using ProjectsBuild.API.Routes;
using Scalar.AspNetCore;

// Add and configure services
var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureHttpJsonOptions(options =>
{
	// Note: Global applied definition for enum int to JSON string serialization/deserialization. Flows through to OpenAPI docs
	options.SerializerOptions.Converters.Add(
		new JsonStringEnumConverter(namingPolicy: JsonNamingPolicy.CamelCase, allowIntegerValues: false)
	);
});

builder.Services.AddExceptionHandler<JsonExceptionHandler>();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails(options =>
{
	options.CustomizeProblemDetails = (context) =>
	{
		Console.WriteLine($"CUSTOMIZE PROBLEM DETAILS"); // LOG
		// Note: Sets ValidationProblemDetails.Errors dictionary keys to camelcase. ".Errors" does not adhere to JsonSerializerOptions
		if (context.ProblemDetails is HttpValidationProblemDetails vpd)
		{
			var camelCaseErrors = vpd.Errors.ToDictionary(
				kvp => char.ToLowerInvariant(kvp.Key[0]) + kvp.Key[1..],
				kvp => kvp.Value
			);
			vpd.Errors = camelCaseErrors;
		}

		var http = context.HttpContext;
		context.ProblemDetails.Instance = $"{http.Request.Method} {http.Request.GetDisplayUrl()}";
		context.ProblemDetails.Extensions.TryAdd("requestId", http.TraceIdentifier);
		context.ProblemDetails.Extensions.TryAdd(
			"traceId",
			http.Features.Get<IHttpActivityFeature>()?.Activity?.Id
		);
	};
});
builder.Services.AddHttpLogging(options =>
{
	options.LoggingFields =
		HttpLoggingFields.RequestProperties
		| HttpLoggingFields.RequestQuery
		| HttpLoggingFields.ResponseStatusCode
		| HttpLoggingFields.Duration;
	options.CombineLogs = true;
});
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
		TypedResults.NotFound(
			new ProblemDetails
			{
				Detail = "The requested resource was not found.",
				Instance = $"{context.Request.Method} {context.Request.GetDisplayUrl()}",
			}
		)
);
app.MapDemoRoutes();
app.MapProjectRoutes();

// Run application
app.Logger.LogInformation("Run application");
app.Run();
