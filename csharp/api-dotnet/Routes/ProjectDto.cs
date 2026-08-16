using System.ComponentModel.DataAnnotations;
using ProjectsBuild.API.Project;

namespace ProjectsBuild.API.Routes;

public sealed record ProjectRequest(
	[Required, Length(ProjectConstants.NameMinLength, ProjectConstants.NameMaxLength)] string Name,
	[MinLength(1, ErrorMessage = "Link must be at least 1 character")] string? Link,
	string? Description,
	string? Notes,
	[Required] ProjectStatus Status, // Note: Support null '?' on enum so binding doesn't throw for null value not matching enum values
	// [property: JsonConverter(typeof(JsonStringEnumConverter)), Required] ProjectStatus Status2, // Note: Support int or string serialization/deserialization
	// [Required, EnumDataType(typeof(ProjectStatus))] ProjectStatus? Status3, // Note: Enforces enum int value validation (throws exception with invalid enum string - binding failure)
	DateOnly? DateCompleted,
	[Range(1, 5)] int? Rating,
	bool? Recommend
);

// test as internal
public sealed record ProjectRequestV(
	string Name,
	string? Link,
	string? Description,
	string? Notes,
	ProjectStatus Status,
	// string StatusS, // transform to ProjectStatus enum
	DateOnly? DateCompleted,
	int? Rating,
	bool? Recommend
) : IValidatableObject
{
	public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
	{
		// Name
		if (string.IsNullOrWhiteSpace(Name))
			yield return new ValidationResult("Name must be provided", [nameof(Name)]);
		else if (Name.Length < ProjectConstants.NameMinLength)
			yield return new ValidationResult(
				$"Name must be at least {ProjectConstants.NameMinLength} characters",
				[nameof(Name)]
			);
		else if (Name.Length > ProjectConstants.NameMaxLength)
			yield return new ValidationResult(
				$"Name cannot be more than {ProjectConstants.NameMaxLength} characters",
				[nameof(Name)]
			);

		// Link
		if (Link is not null && string.IsNullOrWhiteSpace(Link))
			yield return new ValidationResult("Link must be at least 1 character", [nameof(Link)]);

		// Description
		// Notes

		// Status
		if (!Enum.IsDefined(Status))
			yield return new ValidationResult($"Invalid status option", [nameof(Status)]);

		// Status dependent
		if (Status == ProjectStatus.Complete)
		{
			// DateCompleted
			if (DateCompleted is null)
				yield return new ValidationResult(
					"Date completed must be provided",
					[nameof(DateCompleted)]
				);
			else if (DateCompleted > DateOnly.FromDateTime(DateTime.Now))
				yield return new ValidationResult(
					"Date completed cannot be in the future",
					[nameof(DateCompleted)]
				);

			// Rating
			if (Rating is null)
				yield return new ValidationResult("Rating must be provided", [nameof(DateCompleted)]);
			else if (Rating is < 1 or > 5)
				yield return new ValidationResult(
					"Rating must be a whole number 1 through 5",
					[nameof(DateCompleted)]
				);

			// Recommend
			if (Recommend is null)
				yield return new ValidationResult(
					"Recommendation must be provided",
					[nameof(DateCompleted)]
				);
		}
		else
		{
			if (DateCompleted is not null)
				yield return new ValidationResult(
					"Date completed is not assignable",
					[nameof(DateCompleted)]
				);
			if (Rating is not null)
				yield return new ValidationResult("Rating is not assignable", [nameof(DateCompleted)]);
			if (Recommend is not null)
				yield return new ValidationResult(
					"Recommendation is not assignable",
					[nameof(DateCompleted)]
				);
		}
	}
}
