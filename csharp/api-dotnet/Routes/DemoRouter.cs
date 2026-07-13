namespace ProjectsBuild.API.Routes;

internal static class DemoRouter
{
	internal static void MapDemoRoutes(this IEndpointRouteBuilder router)
	{
		var demosRouter = router.MapGroup("/api/demos").WithTags("Demos");
	}
}
