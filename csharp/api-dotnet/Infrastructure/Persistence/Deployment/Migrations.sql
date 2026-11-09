CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" TEXT NOT NULL CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY,
    "ProductVersion" TEXT NOT NULL
);

BEGIN TRANSACTION;
CREATE TABLE "pb_projects" (
    "id" TEXT NOT NULL CONSTRAINT "PK_pb_projects" PRIMARY KEY,
    "name" TEXT NOT NULL,
    "Link" TEXT NULL,
    "Description" TEXT NULL,
    "Notes" TEXT NULL,
    "status" TEXT NOT NULL DEFAULT ('planning'),
    "DateCompleted" TEXT NULL,
    "Rating" INTEGER NULL,
    "Recommend" INTEGER NULL,
    CONSTRAINT "chk_projects_name" CHECK (LENGTH(name) > 1 AND LENGTH(name) <= 125),
    CONSTRAINT "chk_projects_status" CHECK (status IN ('planning', 'building', 'complete'))
);

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20261108200908_InitialCreate', '10.0.14');

COMMIT;

