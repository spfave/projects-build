# Build/Publish
FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:11.0 AS publish
ARG configuration=Release
WORKDIR /src

COPY ["csharp/api-dotnet/api-dotnet.csproj", "csharp/api-dotnet/"]
RUN dotnet restore "csharp/api-dotnet/api-dotnet.csproj"

COPY csharp/ csharp/
WORKDIR "/src/csharp/api-dotnet"
# RUN dotnet build "api-dotnet.csproj" -c $configuration -o /app/build
RUN dotnet publish "api-dotnet.csproj" -c $configuration -o /app/publish /p:UseAppHost=false


# Runtime
FROM mcr.microsoft.com/dotnet/aspnet:11.0  AS final
WORKDIR /app
EXPOSE 5004
ENV ASPNETCORE_URLS=http://+:5004
COPY --from=publish /app/publish .
USER app
ENTRYPOINT ["dotnet", "api-dotnet.dll"]
