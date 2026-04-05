# **Projects.build**
Projects.build is a web application to manage and track project builds. This repository, which includes multiple analogous app implementations, serves as a sandbox for self-learning and experimentation in web application development.


&nbsp;
## **Goal**
Primary: Build experience, develop methodologies, and form opinions on engineering web applications.  
Secondary: Explore various languages, web technologies, and web development frameworks.  

### **Approach**
Develop a web application utilizing a variety web technologies. By addressing the same problem with diverse tools and techniques, identify boundaries of application concerns suitable for abstraction into shared logic, preferred architectural design patterns for structuring code, and strategies for maintaining a largely independent codebase.

Each app implementation relies on a minimal set of dependencies to focus development on using the core features provided by the languages, libraries, and frameworks, while minimizing decisions related to external dependencies. This approach emphasizes experimenting with these core elements as primitives to develop judgment on when abstracting functionality to an external dependency is pragmatic.

The codebase is deliberately over-engineered with regard to overall code organization, utility functions & types, and code logic abstractions. This purposeful complexity targets practicing development within a monorepo, using advanced language features, and making decisions concerning logic co-location and architectural design.


&nbsp;
## **Repo Structure**
The root directory is organized by programming language. With each language directory containing JSON APIs, SPAs, MPAs, and/or fullstack apps. A fullstack implementation of the Project.build application is available through any combination of a server API and client SPA or standalone via a server MPA or fullstack SSR app. Every fullstack implementation delivers equivalent functionality, to create and manage a list of project builds. 


### **Language Implementations**
- [C# .NET](./csharp)
- [Go](./go)  
- [TypeScript](./typescript)  



<!-- 
NOTES:

// Define multi-root workspace to isolate settings, tasks, debug launch profiles by language
./projects-build.code-workspace
{
	"folders": [
		// { "name": "Root", "path": "." }, // to see root files
		{ "name": "TypeScript", "path": "typescript" }
		{ "name": "Go", "path": "go" },
	]
}
 -->