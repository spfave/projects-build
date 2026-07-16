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
		// demoRouter.MapPost("/post-form", );
		// demoRouter.MapPost("/post-json", );
		// demoRouter.MapPost("/validation-filter", );

		// Ref: https://www.roundthecode.com/dotnet-code-examples/basic-authentication-aspnet-core-example
		// demoRouter.MapGet("/auth-basic", );
		// demoRouter.MapGet("/auth-bearer", );
		// demoRouter.MapGet("/rate-limit", );
	}

	internal static async Task Exception()
	{
		Console.WriteLine("Exception "); // LOG
		throw new InvalidOperationException("Demo Exception route");
	}

	internal static async Task<object> GetPathParams(HttpRequest req, string ppa, int ppn)
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

	internal static async Task<object> GetPathQueryParams(
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
}
