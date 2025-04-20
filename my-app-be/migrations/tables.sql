-- This file contains the PostgreSQL commands to create the necessary tables for the application.


CREATE TABLE IF NOT EXISTS "public"."Status" (
    "Status_id" BIGINT PRIMARY KEY NOT NULL,
    "status" VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO "public"."Status" ("Status_id", "status")
VALUES
    (1, 'Ongoing'),
    (2, 'Ongoing After Deadline'),
    (3, 'Finished In Time'),
    (4, 'Finished After Deadline')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS "public"."Priority" (
    "Priority_id" BIGINT PRIMARY KEY NOT NULL,
    "priority" VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO "public"."Priority" ("Priority_id", "priority")
VALUES
    (1, 'Low'),
    (2, 'Lower'),
    (3, 'Middle'),
    (4, 'Higher'),
    (5, 'High')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS "public"."AssignmentType" (
    "Type_id" BIGINT PRIMARY KEY NOT NULL,
    "type" VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO "public"."AssignmentType" ("Type_id", "type")
VALUES
    (1, 'Task'),
    (2, 'Bug')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS "public"."Account" (
    "Account_id" BIGSERIAL PRIMARY KEY NOT NULL,
    "username" VARCHAR(100) NOT NULL UNIQUE,
    "password" VARCHAR(100) NOT NULL,
    "email" VARCHAR(1000) NOT NULL UNIQUE,
    "is_admin" BOOL NOT NULL
);

CREATE TABLE IF NOT EXISTS "public"."Project" (
    "Project_id" BIGSERIAL NOT NULL PRIMARY KEY,
    "Account_id" BIGINT NOT NULL,
    "Priority_id" BIGINT NOT NULL,
    "Status_id" BIGINT NOT NULL,
    "project_title" VARCHAR(150) NOT NULL UNIQUE,
    "project_description" TEXT NOT NULL,
    "start_time" DATE NOT NULL,
    "end_time" DATE NOT NULL,
    "finished_time" DATE NOT NULL,
    CONSTRAINT "Project_Account_fk" FOREIGN KEY ("Account_id") 
        REFERENCES "public"."Account" ("Account_id") ON DELETE CASCADE,
    CONSTRAINT "Project_Priority_fk" FOREIGN KEY ("Priority_id") 
        REFERENCES "public"."Priority" ("Priority_id") ON DELETE CASCADE,
    CONSTRAINT "Project_Status_fk" FOREIGN KEY ("Status_id") 
        REFERENCES "public"."Status" ("Status_id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "public"."ProjectTeamMember" (
    "Project_Team_Member_id" BIGSERIAL NOT NULL PRIMARY KEY,
    "Account_id" BIGINT NOT NULL,
    "Project_id" BIGINT NOT NULL,
    CONSTRAINT "ProjectTeamMember_Account_fk" FOREIGN KEY ("Account_id") 
        REFERENCES "public"."Account" ("Account_id") ON DELETE CASCADE,
    CONSTRAINT "ProjectTeamMember_Project_fk" FOREIGN KEY ("Project_id") 
        REFERENCES "public"."Project" ("Project_id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "public"."Assignment" (
    "Assignment_id" BIGSERIAL NOT NULL PRIMARY KEY,
    "Project_id" BIGINT NOT NULL,
    "Parent_Assignment_id" BIGINT, 
    "Type_id" BIGINT NOT NULL,
    "Priority_id" BIGINT NOT NULL,
    "Status_id" BIGINT NOT NULL,
    "assignment_title" VARCHAR(150) NOT NULL,
    "assignment_description" TEXT NOT NULL,
    "start_time" DATE NOT NULL,
    "end_time" DATE NOT NULL,
    "finished_time" DATE NOT NULL,
    CONSTRAINT "Assignment_Project_fk" FOREIGN KEY ("Project_id") 
        REFERENCES "public"."Project" ("Project_id") ON DELETE CASCADE,
    CONSTRAINT "Assignment_Assignment_fk" FOREIGN KEY ("Parent_Assignment_id") 
        REFERENCES "public"."Assignment" ("Assignment_id") ON DELETE CASCADE,
    CONSTRAINT "Assignment_Type_fk" FOREIGN KEY ("Type_id") 
        REFERENCES "public"."AssignmentType" ("Type_id") ON DELETE CASCADE,
    CONSTRAINT "Assignment_Priority_fk" FOREIGN KEY ("Priority_id") 
        REFERENCES "public"."Priority" ("Priority_id") ON DELETE CASCADE,
    CONSTRAINT "Assignment_Status_fk" FOREIGN KEY ("Status_id") 
        REFERENCES "public"."Status" ("Status_id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "public"."AssignmentMember" (
    "Project_Team_Member_id" BIGINT NOT NULL,
    "Assignment_id" BIGINT NOT NULL,
    CONSTRAINT "AssignmentMember_ProjectTeamMember_fk" FOREIGN KEY ("Project_Team_Member_id") 
        REFERENCES "public"."ProjectTeamMember" ("Project_Team_Member_id") ON DELETE CASCADE,
    CONSTRAINT "AssignmentMember_Assignment_fk" FOREIGN KEY ("Assignment_id") 
        REFERENCES "public"."Assignment" ("Assignment_id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "session" (
    "sid" varchar NOT NULL PRIMARY KEY,
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL
);

