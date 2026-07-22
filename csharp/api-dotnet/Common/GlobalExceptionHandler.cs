using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace ProjectsBuild.API.Common;

// Refs:
// - https://www.youtube.com/watch?v=eN4GX5WW87s&list=WL
// - https://www.youtube.com/watch?v=rXdsm9R5TR0&list=WL
internal sealed class GlobalExceptionHandler : IExceptionHandler
{
	public async ValueTask<bool> TryHandleAsync(
		HttpContext httpContext,
		Exception exception,
		CancellationToken ct
	)
	{
		Console.WriteLine($"GLOBAL EXCEPTION HANDLER"); // LOG

		httpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;
		await httpContext.Response.WriteAsJsonAsync(
			new ProblemDetails
			{
				Type = "https://tools.ietf.org/html/rfc7231#section-6.6.1",
				Status = StatusCodes.Status500InternalServerError,
				Title = exception.GetType().Name,
				Detail = exception.Message,
			},
			ct
		);

		return true;
	}
}
