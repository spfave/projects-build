using System.Text.Json;
using Microsoft.AspNetCore.Diagnostics;

namespace ProjectsBuild.API.Application;

internal sealed class JsonExceptionHandler(IProblemDetailsService problemDetailsService)
	: IExceptionHandler
{
	public async ValueTask<bool> TryHandleAsync(
		HttpContext httpContext,
		Exception exception,
		CancellationToken ct
	)
	{
		if (exception.InnerException is not JsonException)
			return false;

		Console.WriteLine($"JSON EXCEPTION HANDLER"); // LOG

		var problem = new HttpValidationProblemDetails
		{
			Status = StatusCodes.Status400BadRequest,
			// Title = exception.InnerException.GetType().Name,
			Detail = exception.InnerException.Message,
		};
		// if (environment.IsDevelopment())
		// {
		// 	problem.Extensions.TryAdd("exception", exception.ToString());
		// 	problem.Extensions.TryAdd("innerException", exception.InnerException.ToString());
		// }

		return await problemDetailsService.TryWriteAsync(
			new ProblemDetailsContext
			{
				HttpContext = httpContext,
				Exception = exception,
				ProblemDetails = problem,
			}
		);
	}
}
