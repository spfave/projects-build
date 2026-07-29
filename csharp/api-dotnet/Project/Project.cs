namespace ProjectsBuild.API.Project;

// Note: Type applied definition for enum int to JSON string serialization/deserialization. Cannot specify namingPolicy with attribute (e.g. camel case)
// [JsonConverter(typeof(JsonStringEnumConverter))]
public enum ProjectStatus
{
	// [JsonStringEnumMemberName("plan")] // Note: Define custom string value for serialization/deserialization. Works with global applied or type applied serialization/deserialization. Flows through to OpenAPI docs
	Planning,
	Building,
	Complete,
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
