# **C#/.Net**


&nbsp;
## **Directory structure**


### **Projects**
- [API ASP.NET](./api-dotnet/)
<!-- - [Core](./Core) -->
<!-- - [Infrastructure](./Infrastructure) -->
<!-- - [Library](./Library) -->

### **Local Dev Access Links**
http://localhost:5004/openapi/scalar/projects-build#description/introduction
http://localhost:5004/openapi/projects-build.json


### **Container Management**
```sh
# build image
# docker build -f csharp/api-dotnet/Dockerfile [OPTIONS: --build-arg configuration=Debug] -t <image-name>:<image-tag> .
docker build -f csharp/api-dotnet/Dockerfile --build-arg configuration=Debug -t api-dotnet:debug .

# run container
# docker run --rm --name <container-name> -p <access-port>:<container-port> [ENV VARs: -e ASPNETCORE_ENVIRONMENT=Development] <image-name>:<image-tag>
docker run --name c-api-dotnet-nodb -p 5005:5004 -e ASPNETCORE_ENVIRONMENT=Development api-dotnet:debug
```


&nbsp;
## **References**
[C#](https://learn.microsoft.com/en-us/dotnet/csharp/tour-of-csharp/overview)  
[.NET](https://learn.microsoft.com/en-us/dotnet/core/get-started)  
[.NET CLI](https://learn.microsoft.com/en-us/dotnet/core/tools/)  
[ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/overview)  
[.NET Data Access](https://learn.microsoft.com/en-us/dotnet/navigate/data-access/)  
[EF Core](https://learn.microsoft.com/en-us/ef/core/)  

[Milan Jovanovic: .NET Vertical Slice Architecture](https://milanjovanovic.tech/blog/vertical-slice-architecture-dotnet)  
[Code with Mukesh: .NET Web API Zero to Hero](https://codewithmukesh.com/courses/dotnet-webapi-zero-to-hero/lessons/)  
[Code with Mukesh: Clean Architecture](https://codewithmukesh.com/blog/clean-architecture-dotnet/#what-is-clean-architecture)  
[Code with Mukesh: ASP.NET + EF Core Web API](https://codewithmukesh.com/blog/aspnet-core-webapi-crud-with-entity-framework-core-full-course/)  

[GitHub: .NET Web API Zero to Hero](https://github.com/codewithmukesh/dotnet-webapi-zero-to-hero-course)  
[GitHub: Structured Minimal API](https://github.com/jonowilliams26/StructuredMinimalApi/tree/master)  
