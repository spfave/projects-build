using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace ProjectsBuild.API.Routes;

internal static class DemoRouter
{
	internal static void MapDemoRoutes(this IEndpointRouteBuilder router)
	{
		var demoRouter = router.MapGroup("/api/demos").WithTags("Demos");

		demoRouter.MapGet("/exception", Exception).WithSummary("Throw Exception");

		demoRouter
			.MapGet("/get-path-params/{ppa}/next/{ppn}", GetPathParams)
			.WithSummary("Get URL path params");
		demoRouter
			// Note: If param constraints aren't satisfied URL match is not made -> return 404 not found
			.MapGet("/get-path-params/{ppa:alpha}/nextc/{ppn:int}", GetPathParams)
			.WithSummary("Get URL path params with constraints");
		demoRouter
			.MapGet("/get-path-query-params/{ppa?}", GetPathQueryParams) // optional param
			// .MapGet("/get-path-query-params/{ppa=xyz}", GetPathQueryParams) // optional param with default
			.WithSummary("Get URL path and query params");
		demoRouter.MapPost("/post-form", PostForm).DisableAntiforgery().WithSummary("Post form data");
		demoRouter.MapPost("/post-json", PostJsonBody).WithSummary("Post JSON data");
		demoRouter
			.MapPost("/post-validation", PostValidation)
			.WithSummary("Post JSON data with validation");

		demoRouter.MapGet("/context-user", (Delegate)ContextUser).WithSummary("Get context user");
		// Ref: https://www.roundthecode.com/dotnet-code-examples/basic-authentication-aspnet-core-example
		// demoRouter.MapGet("/auth-basic", );
		// demoRouter.MapGet("/auth-bearer", );
		// demoRouter.MapGet("/rate-limit", );
	}

	private static async Task Exception()
	{
		Console.WriteLine("Exception "); // LOG
		throw new InvalidOperationException("Demo Exception route");
	}

	private static async Task<object> GetPathParams(HttpRequest req, string ppa, int ppn)
	{
		return TypedResults.Ok(
			new
			{
				ppa,
				ppn,
				routeValue = req.RouteValues,
			}
		);
	}

	private static async Task<object> GetPathQueryParams(
		HttpRequest req,
		string? ppa,
		string? qpa,
		int? qpn
	)
	{
		return TypedResults.Ok(
			new
			{
				ppa,
				qpa,
				qpn,
				pathParams = req.RouteValues,
				queryParams = req.Query,
				queryString = req.QueryString.Value,
			}
		);
	}

	private record Todo(string Title, string Content, bool Completed, int Priority = 1);

	// Note: Target class/record MUST be public for validation to trigger
	public record ValidTodo(
		[Required, Length(2, 20)] string Title,
		[MinLength(2)] string Content,
		bool Completed,
		[Range(1, 5)] int Priority = 1
	);

	private static async Task<object> PostForm(
		HttpRequest req,
		[FromForm] Todo todo,
		CancellationToken ct
	)
	{
		var form = req.Form;
		var formAsync = await req.ReadFormAsync(ct);
		return TypedResults.Created(
			"/todo-formdata",
			new
			{
				todo,
				form,
				formAsync,
			}
		);
	}

	// Note: Can only read from body once
	private static async Task<object> PostJsonBody(Todo todo)
	// private static async Task<object> PostJsonBody(HttpRequest req)
	{
		// var bodyAsync = await req.ReadFromJsonAsync<Todo>();
		return TypedResults.Created(
			"/todo-json",
			new { todo }
		// new { bodyAsync }
		);
	}

	private static async Task<object> PostValidation(ValidTodo todo)
	{
		return TypedResults.Created("/todo-valid", new { todo });
	}

	private static async Task<object> ContextUser(HttpContext context)
	{
		var user = context.User;
		return TypedResults.Ok(new { user });
	}
}
