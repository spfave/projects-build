using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpLogging;
using ProjectsBuild.API.Application;
using Scalar.AspNetCore;

namespace ProjectsBuild.Api;

internal static class ApiServiceCollectionExtensions
{
	internal static IServiceCollection ConfigureApiJsonOptions(this IServiceCollection services)
	{
		services.ConfigureHttpJsonOptions(options =>
		{
			options.SerializerOptions.DictionaryKeyPolicy = JsonNamingPolicy.CamelCase;
			options.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
			// Note: Global applied definition for enum int to JSON string serialization/deserialization. Flows through to OpenAPI docs
			options.SerializerOptions.Converters.Add(
				new JsonStringEnumConverter(
					namingPolicy: JsonNamingPolicy.CamelCase,
					allowIntegerValues: false
				)
			);
		});
		return services;
	}

	internal static IServiceCollection AddApiExceptionHandling(this IServiceCollection services)
	{
		services.AddExceptionHandler<JsonExceptionHandler>();
		services.AddExceptionHandler<GlobalExceptionHandler>();
		return services;
	}

	internal static IServiceCollection AddApiProblemDetailsHandling(this IServiceCollection services)
	{
		services.AddProblemDetails(options =>
		{
			options.CustomizeProblemDetails = (context) =>
			{
				Console.WriteLine($"CUSTOMIZE PROBLEM DETAILS"); // LOG
				var http = context.HttpContext;
				context.ProblemDetails.Instance = $"{http.Request.Method} {http.Request.GetDisplayUrl()}";
				context.ProblemDetails.Extensions.TryAdd("requestId", http.TraceIdentifier);
				context.ProblemDetails.Extensions.TryAdd(
					"traceId",
					http.Features.Get<IHttpActivityFeature>()?.Activity?.Id
				);
			};
		});
		return services;
	}

	internal static IServiceCollection AddApiHttpLogging(this IServiceCollection services)
	{
		services.AddHttpLogging(options =>
		{
			options.LoggingFields =
				HttpLoggingFields.RequestProperties
				| HttpLoggingFields.RequestQuery
				| HttpLoggingFields.ResponseStatusCode
				| HttpLoggingFields.Duration;
			options.CombineLogs = true;
		});
		return services;
	}

	internal static IServiceCollection AddApiDocumentation(this IServiceCollection services)
	{
		services.AddOpenApi(
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
		return services;
	}
}

internal static class ApiApplicationBuilderExtensions
{
	internal static IApplicationBuilder UseApiMiddleware(this WebApplication app)
	{
		return app.Use(
			async (context, next) =>
			{
				context.Response.OnStarting(() =>
				{
					context.Response.Headers.Append("Application-Name", "API-dotnet");
					return Task.CompletedTask;
				});
				await next(context);
			}
		);
	}

	internal static IEndpointConventionBuilder MapApiDocumentation(this WebApplication app)
	{
		return app.MapScalarApiReference(
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
}
