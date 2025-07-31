CREATE TABLE "public"."user" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "name" varchar(100) NOT NULL,
  "email" varchar(255) NOT NULL UNIQUE,
  "password" varchar(255) NOT NULL
)

CREATE TABLE "public"."todo" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "title" varchar(255) NOT NULL,
  "description" text,
  "user_id" integer NOT NULL,
  CONSTRAINT "todo_id_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."user" ("id")
)