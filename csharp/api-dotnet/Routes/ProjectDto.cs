using System.ComponentModel.DataAnnotations;
using ProjectsBuild.API.Project;

namespace ProjectsBuild.API.Routes;

public sealed record ProjectRequest(
	[Required] string Name,
	// [Required, Length(ProjectConstants.NameMinLength, ProjectConstants.NameMaxLength)] string Name,
	// [MinLength(1)] string? Link,
	// [MinLength(1)] string? Description,
	// [MinLength(1)] string? Notes,

	[Required] ProjectStatus? Status, // Note: Support null '?' on enum so binding doesn't throw for null value not matching enum values
	// [property: JsonConverter(typeof(JsonStringEnumConverter)), Required] ProjectStatus Status2, // Note: Support int or string serialization/deserialization
	[Required, EnumDataType(typeof(ProjectStatus))] ProjectStatus? Status3, // Note: Enforces enum int value validation (throws exception with invalid enum string - binding failure)
	// DateOnly? DateCompleted,
	// [Range(1, 5)] int? Rating,
	bool? Recommend
);
