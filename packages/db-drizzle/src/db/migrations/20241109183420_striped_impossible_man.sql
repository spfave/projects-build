CREATE TABLE `projects` (
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
	`updated_at` integer
);
