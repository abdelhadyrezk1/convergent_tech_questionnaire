CREATE TABLE `assets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`questionnaireId` int NOT NULL,
	`productType` enum('UPS','Precision Cooling','Racks','PDUs','Busway','Aisle Containments','Surveillance','Access Control','Fire Alarm','Fire Fighting','Electrica') NOT NULL,
	`contractor` varchar(255),
	`manufacturer` varchar(255),
	`model` varchar(255),
	`technology` varchar(255),
	`topology` enum('Standalone','N+1','N+2','2N','Redundan'),
	`manufacturingDate` varchar(10),
	`startupDate` varchar(10),
	`capacity` varchar(100),
	`unitCount` int,
	`status` enum('Active','Standby','Shutdown','Malfunction','Needs Maintenance','EOL') NOT NULL,
	`specificData` text,
	`maintenanceNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `assets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dcimAssessments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`questionnaireId` int NOT NULL,
	`hasDCIM` enum('نعم','لا') NOT NULL,
	`dcimSystemName` varchar(255),
	`dcimFeatures` text,
	`currentChallenges` text,
	`needsDCIM` enum('نعم','لا','غير متأكد') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dcimAssessments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `questionnaires` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`clientName` varchar(255) NOT NULL,
	`dataCenterName` varchar(255) NOT NULL,
	`location` enum('الرياض','جدة','الخبر','أخرى في KSA') NOT NULL,
	`address` text,
	`contactName` varchar(255),
	`contactPhone` varchar(20),
	`contactEmail` varchar(320),
	`dataCenterStartDate` int,
	`visitDate` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `questionnaires_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reportSummaries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`questionnaireId` int NOT NULL,
	`reportContent` text,
	`generatedAt` timestamp NOT NULL DEFAULT (now()),
	`exportedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reportSummaries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `salesOpportunities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`questionnaireId` int NOT NULL,
	`assetId` int,
	`opportunityType` enum('Spare Parts Offer','Maintenance Contract','UPS Upgrade','Cooling Modernization','EcoStruxure I') NOT NULL,
	`description` text,
	`priority` enum('High','Medium','Low') DEFAULT 'Medium',
	`estimatedValue` int,
	`followUpDate` timestamp,
	`status` enum('Open','In Progress','Won','Lost') DEFAULT 'Open',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `salesOpportunities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `assets` ADD CONSTRAINT `assets_questionnaireId_questionnaires_id_fk` FOREIGN KEY (`questionnaireId`) REFERENCES `questionnaires`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `dcimAssessments` ADD CONSTRAINT `dcimAssessments_questionnaireId_questionnaires_id_fk` FOREIGN KEY (`questionnaireId`) REFERENCES `questionnaires`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `questionnaires` ADD CONSTRAINT `questionnaires_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reportSummaries` ADD CONSTRAINT `reportSummaries_questionnaireId_questionnaires_id_fk` FOREIGN KEY (`questionnaireId`) REFERENCES `questionnaires`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `salesOpportunities` ADD CONSTRAINT `salesOpportunities_questionnaireId_questionnaires_id_fk` FOREIGN KEY (`questionnaireId`) REFERENCES `questionnaires`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `salesOpportunities` ADD CONSTRAINT `salesOpportunities_assetId_assets_id_fk` FOREIGN KEY (`assetId`) REFERENCES `assets`(`id`) ON DELETE no action ON UPDATE no action;