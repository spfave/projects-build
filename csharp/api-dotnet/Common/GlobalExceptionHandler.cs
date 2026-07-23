using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;

namespace ProjectsBuild.API.Common;

// Refs:
// - https://www.youtube.com/watch?v=eN4GX5WW87s&list=WL
// - https://www.youtube.com/watch?v=rXdsm9R5TR0&list=WL
internal sealed class GlobalExceptionHandler(
	IProblemDetailsService problemDetailsService,
	ILogger<GlobalExceptionHandler> logger
) : IExceptionHandler
{
	public async ValueTask<bool> TryHandleAsync(
		HttpContext httpContext,
		Exception exception,
		CancellationToken ct
	)
	{
		Console.WriteLine($"GLOBAL EXCEPTION HANDLER"); // LOG
		var instance = $"{httpContext.Request.Method} {httpContext.Request.GetDisplayUrl()}";
		var requestId = httpContext.TraceIdentifier;
		var activityId = httpContext.Features.Get<IHttpActivityFeature>()?.Activity?.Id;
		logger.LogError(
			exception,
			"Unhandled exception occured. Message={Message} Instance={Instance} RequestId={RequestId} TraceId={ActivityId} TimeUtc={TimeUtc}",
			exception.Message,
			instance,
			requestId,
			activityId,
			DateTime.UtcNow
		);

		// Problem details approach to writing response
		return await problemDetailsService.TryWriteAsync(
			new ProblemDetailsContext
			{
				HttpContext = httpContext,
				Exception = exception,
				ProblemDetails = new ProblemDetails
				{
					Type = "https://tools.ietf.org/html/rfc7231#section-6.6.1",
					Status = StatusCodes.Status500InternalServerError,
					Title = exception.GetType().Name,
					Detail = exception.Message,
				},
			}
		);

		// Manual approach to writing response
		// httpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;
		// await httpContext.Response.WriteAsJsonAsync(
		// 	new ProblemDetails
		// 	{
		// 		Type = "https://tools.ietf.org/html/rfc7231#section-6.6.1",
		// 		Status = StatusCodes.Status500InternalServerError,
		// 		Title = exception.GetType().Name,
		// 		Detail = exception.Message,
		// 	},
		// 	ct
		// );

		// return true;
	}
}
