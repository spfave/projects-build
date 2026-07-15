namespace ProjectsBuild.API.Routes;

internal static class DemoRouter
{
	internal static void MapDemoRoutes(this IEndpointRouteBuilder router)
	{
		var demoRouter = router.MapGroup("/api/demos").WithTags("Demos");

		demoRouter.MapGet("/exception", Exception).WithSummary("Throw Exception");

		demoRouter.MapGet("/get-params/{ap}/next/{np}", GetParams).WithSummary("Get URL Params");
		demoRouter
			// Note: If param constraints aren't satisfied URL match is not made -> return 404 not found
			.MapGet("/get-params/{ap:alpha}/nextc/{np:int}", GetParams)
			.WithSummary("Get URL Params with constraints");
		// demoRouter.MapGet("/get-query-params", );
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

	internal static async Task<object> GetParams(HttpRequest req, string ap, int np)
	{
		return TypedResults.Ok(
			new
			{
				ap,
				np,
				routeValue = req.RouteValues,
			}
		);
	}
}
