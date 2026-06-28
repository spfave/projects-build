CREATE TABLE `pb_timestamps` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`text` text,
	`num_created_at` integer,
	`num_updated_at` integer,
	`txt_created_at` text,
	`txt_updated_at` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `pb_projects` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`link` text,
	`description` text,
	`notes` text,
	`status` text DEFAULT 'planning' NOT NULL,
	`date_completed` text,
	`rating` integer,
	`recommend` integer,
	`created_at` integer,
	`updated_at` integer,
	CONSTRAINT "chk_name" CHECK(length("pb_projects"."name") > 1 AND length("pb_projects"."name") <= 125),
	CONSTRAINT "chk_status" CHECK("pb_projects"."status" IN ('planning', 'building', 'complete')),
	CONSTRAINT "chk_dateCompleted" CHECK(("pb_projects"."status" == 'complete' AND "pb_projects"."date_completed" IS NOT NULL) OR ("pb_projects"."status" != 'complete' AND "pb_projects"."date_completed" IS NULL)),
	CONSTRAINT "chk_rating" CHECK(("pb_projects"."status" == 'complete' AND "pb_projects"."rating" IS NOT NULL AND "pb_projects"."rating" >= 1 AND "pb_projects"."rating" <= 5) OR ("pb_projects"."status" != 'complete' AND "pb_projects"."rating" IS NULL)),
	CONSTRAINT "chk_recommend" CHECK(("pb_projects"."status" == 'complete' AND "pb_projects"."recommend" IS NOT NULL) OR ("pb_projects"."status" != 'complete' AND "pb_projects"."recommend" IS NULL))
);
--> statement-breakpoint
DROP TABLE `projects`;