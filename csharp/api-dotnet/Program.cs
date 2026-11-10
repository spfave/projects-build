using ProjectsBuild.Api;
using ProjectsBuild.Infrastructure;

// Add and configure services
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddInfraSqliteDatabase(builder.Configuration);

builder.Services.ConfigureApiJsonOptions();
builder.Services.AddApiExceptionHandling();
builder.Services.AddApiProblemDetailsHandling();
builder.Services.AddApiHttpLogging();
builder.Services.AddHealthChecks();
builder.Services.AddValidation();
builder.Services.AddApiDocumentation();

// Build and configure application
var app = builder.Build();

app.UseExceptionHandler();
if (app.Environment.IsDevelopment())
{
	await app.Services.MigrateInfraDatabase();

	app.UseApiMiddleware();
	app.UseHttpLogging();
	app.UseStatusCodePages();
	app.MapOpenApi();
	app.MapApiDocumentation();
}

app.MapApiRoutes();

// Run application
app.Logger.LogInformation("Run application");
app.Run();
