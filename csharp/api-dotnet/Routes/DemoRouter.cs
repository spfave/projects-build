using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace ProjectsBuild.API.Routes;

internal static class DemoRouter
{
	internal static void MapDemoRoutes(this IEndpointRouteBuilder router)
	{
		var demoRouter = router.MapGroup("/api/demos").WithTags("Demos");

		// Exception handling & problem detail demos
		// - https://learn.microsoft.com/en-us/aspnet/core/fundamentals/error-handling-api
		// - https://www.youtube.com/watch?v=-TGZypSinpw&list=WL
		// - https://www.youtube.com/watch?v=eN4GX5WW87s&list=WL
		// - https://www.youtube.com/watch?v=rXdsm9R5TR0&list=WL
		demoRouter.MapGet("/throw-exception", ThrowException).WithSummary("Throw Exception");
		// Note: Regarding capture inferred response status codes in openapi documentation
		// - With inline handler returning a single TypedResults.<...> response code is inferred
		// - With named method handler returning a single TypedResults.<...> response code is inferred as 200 regardless. Must declare return type on named handler to infer response code. Using .Produces(StatusCodes.<...>) will add status code to openapi json doc in addition to 200 but it will not be in the scale openapi ui doc.
		// - With inline handler or name method returning multiple TypedResults.<...> response codes, must declare all return types to infer response codes
		demoRouter.MapGet("/bad-request-inline", () => TypedResults.BadRequest());
		demoRouter.MapGet("/bad-request", BadRequest); //.Produces(StatusCodes.Status400BadRequest);
		demoRouter.MapGet(
			"/status-inline/{code:int}",
			async Task<Results<Ok, BadRequest, UnauthorizedHttpResult, NotFound, InternalServerError>> (
				[FromRoute] int code
			) =>
			{
				return code switch
				{
					200 => TypedResults.Ok(),
					400 => TypedResults.BadRequest(),
					401 => TypedResults.Unauthorized(),
					404 => TypedResults.NotFound(),
					_ => TypedResults.InternalServerError(),
				};
			}
		);
		demoRouter.MapGet("/status/{code:int}", Status);
		demoRouter.MapPost("/problem", Problem);
		demoRouter.MapPost("/validation-problem", ValidationProblem);

		// Parameter binding demos
		// - https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis/parameter-binding
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

		// Middleware & filter demos
		// - https://learn.microsoft.com/en-us/aspnet/core/fundamentals/middleware/
		// - https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis/min-api-filters
		demoRouter
			.MapGet("/http-context", (Delegate)HttpContext)
			.WithSummary("Get http context data");
		// Ref: https://www.roundthecode.com/dotnet-code-examples/basic-authentication-aspnet-core-example
		// demoRouter.MapGet("/auth-basic", );
		// demoRouter.MapGet("/auth-bearer", );
		// demoRouter.MapGet("/rate-limit", );
		demoRouter
			.MapPut("/route-filter", HandlerWithFilters)
			.AddEndpointFilter(
				async (context, next) =>
				{
					Console.WriteLine($"DEMO ROUTE: demo endpoint filter inline"); // LOG
					return await next(context);
				}
			)
			.AddEndpointFilter<DemoFilter>();
	}

	private static async Task ThrowException()
	{
		Console.WriteLine("DEMO ROUTE: exception"); // LOG
		throw new InvalidOperationException("Demo throw exception route");
	}

	private sealed record MessageResponse(string Message);

	private static async Task<
		Results<
			Ok<MessageResponse>,
			BadRequest<MessageResponse>,
			UnauthorizedHttpResult,
			NotFound<MessageResponse>,
			InternalServerError<MessageResponse>
		>
	> Status([FromRoute] int code)
	{
		return code switch
		{
			200 => TypedResults.Ok(new MessageResponse("Demo status OK route")),
			400 => TypedResults.BadRequest(new MessageResponse("Demo status Bad Request route")),
			401 => TypedResults.Unauthorized(),
			404 => TypedResults.NotFound(new MessageResponse("Demo status Not Found route")),
			_ => TypedResults.InternalServerError(
				new MessageResponse("Demo status Internal Server Error route")
			),
		};
	}

	// private static async Task<object> BadRequest()
	// private static async Task<BadRequest> BadRequest()
	private static async Task<BadRequest<MessageResponse>> BadRequest()
	{
		// return TypedResults.BadRequest();
		return TypedResults.BadRequest(new MessageResponse("Demo Bad Request route"));
	}

	private static async Task<ProblemHttpResult> Problem()
	{
		return TypedResults.Problem();
	}

	private static async Task<ValidationProblem> ValidationProblem()
	{
		// return TypedResults.ValidationProblem(errors: []);
		return TypedResults.ValidationProblem(
			errors: new Dictionary<string, string[]>
			{
				["title"] = new[] { "Title is required" },
				["content"] = ["Content is required"],
			}
		// errors:
		// [
		// 	new KeyValuePair<string, string[]>("title", new[] { "Title is required" }),
		// 	new KeyValuePair<string, string[]>("content", ["Content is required"]),
		// ]
		);
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

	private sealed record Todo(string Title, string Content, bool Completed, int Priority = 1);

	// Note: Target class/record MUST be public for validation to trigger
	public sealed record ValidTodo(
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
		var formAsync = await req.ReadFormAsync(ct);
		var form = req.Form;
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

	private static async Task<object> HttpContext(HttpContext context)
	{
		var user = context.User;
		var requestId = context.TraceIdentifier;
		var activity = context.Features.Get<IHttpActivityFeature>()?.Activity;
		return TypedResults.Ok(
			new
			{
				user,
				requestId,
				traceId = activity?.Id,
			}
		);
	}

	private static async Task<Ok<MessageResponse>> HandlerWithFilters()
	{
		Console.WriteLine($"DEMO ROUTE: handler with filters"); // LOG
		return TypedResults.Ok(new MessageResponse("After filters"));
	}

	private sealed class DemoFilter : IEndpointFilter
	{
		public async ValueTask<object?> InvokeAsync(
			EndpointFilterInvocationContext context,
			EndpointFilterDelegate next
		)
		{
			Console.WriteLine($"DEMO ROUTE: demo IEndpoint implementation"); // LOG
			return await next(context);
		}
	}
}
