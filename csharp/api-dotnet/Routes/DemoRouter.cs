namespace ProjectsBuild.API.Routes;

internal static class DemoRouter
{
	internal static void MapDemoRoutes(this IEndpointRouteBuilder router)
	{
		var demoRouter = router.MapGroup("/api/demos").WithTags("Demos");

		demoRouter.MapGet("/exception", Exception);

		// demoRouter.MapGet("/get-params", );
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
}
