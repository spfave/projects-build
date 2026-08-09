// global using ProjectId = string; // Note: Works but overrides to much

namespace ProjectsBuild.API.Project;

public static class ProjectConstants
{
	public const int IdLength = 8;
	public const int NameMinLength = 2;
	public const int NameMaxLength = 125;
	public static readonly IReadOnlyList<string> Statuses = ["planning", "building", "complete"];

	private static readonly Dictionary<string, string> ProjectStatusDict = Statuses.ToDictionary(
		ps => ps.ToUpperInvariant(),
		ps => ps
	);
}

public sealed record ProjectId(string Id);

// Note: Type applied definition for enum int to JSON string serialization/deserialization. Cannot specify namingPolicy with attribute (e.g. camel case)
// [JsonConverter(typeof(JsonStringEnumConverter))]
public enum ProjectStatus
{
	// [JsonStringEnumMemberName("plan")] // Note: Define custom string value for serialization/deserialization. Works with global applied or type applied serialization/deserialization. Flows through to OpenAPI docs
	Planning,
	Building,
	Complete,
}

public sealed class Project
{
	// public required ProjectId Id { get; init; }
	public required string Id { get; init; }
	public required string Name { get; set; }
	public string? Link { get; set; }
	public string? Description { get; set; }
	public string? Notes { get; set; }
	public required ProjectStatus Status { get; set; }
	public DateOnly? DateCompleted { get; set; }
	public int? Rating { get; set; }
	public bool? Recommend { get; set; }
}

// ----------------------------------------------------------------------------------- //
// Note: Exploration

// public static class ProjectStatusC
// {
// 	public const string Planning = "planning";
// 	public const string Building = "building";
// 	public const string Complete = "complete";
// }

// Refs
// - https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/union
// - https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/tutorials/unions
// public readonly union ProjectStatusU("planning", "building", "complete"); // invalid
