var builder = WebApplication.CreateBuilder(args);
builder.Services.AddOpenApi();

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
	app.MapOpenApi();
}

app.MapGet("/", () => "Hello World!");
app.MapGet("/projects", () => "get projects");
app.MapGet("/projects/{id}", (string id) => $"get project {id}");
app.MapPost("/projects", () => "create project");
app.MapPut("/projects/{id}", (string id) => $"updated project {id}");



app.MapDelete("/projects/{id}", (string id) => $"delete project {id}");

app.Run();
