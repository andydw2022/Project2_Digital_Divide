-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.
-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.

DROP TABLE "Country_Speed_Rank";
DROP TABLE "Country_Internet_Usage";
DROP TABLE "Country_ISO_3_Digit_Code";
DROP TABLE "Country_population";
DROP TABLE "Combined_Internet_Country";

CREATE TABLE "Country_Speed_Rank" (
    "country" varchar(100)   NOT NULL,
    "rank" int   NOT NULL,
    "download_speed_MBPS" float   NOT NULL,
    "upload_speed_MBPS" float   NOT NULL,
    "download_tests" int   NOT NULL,
    "upload_tests" int   NOT NULL,
    "No_IPs" int   NOT NULL,
    CONSTRAINT "pk_Counry_Speed_Rank" PRIMARY KEY (
        "country"
     )
);

CREATE TABLE "Country_Internet_Usage" (
    "country" varchar(100)   NOT NULL,
    "incomeperperson" float   NOT NULL,
    "internetusage" float   NOT NULL,
    "urbanrate" float   NOT NULL,
    CONSTRAINT "pk_Country_Internet_Usage" PRIMARY KEY (
        "country"
     )
);

CREATE TABLE "Country_ISO_3_Digit_Code" (
    "country" varchar(100)   NOT NULL,
    "countrycode" varchar(3)   NOT NULL,
    CONSTRAINT "pk_Country_ISO_3_Digit_Code" PRIMARY KEY (
        "country"
     )
);

CREATE TABLE "Country_population" (
    "country" varchar(100)   NOT NULL,
    "femalepop" int ,  
    "malepop" int ,  
    "totpop" int  ,
    CONSTRAINT "pk_Country_population" PRIMARY KEY (
        "country"
     )
);

CREATE TABLE "Combined_Internet_Country" (
    "country" varchar(100)   NOT NULL,
    "countrycode" varchar(3)   NOT NULL,
    "rank" int   NOT NULL,
    "download_speed_MBPS" float   NOT NULL,
    "upload_speed_MBPS" float   NOT NULL,
    "incomeperperson" float   NOT NULL,
    "internetusagerate" float   NOT NULL,
    "urbanrate" float   NOT NULL,
    "total_population" float   NOT NULL,
    CONSTRAINT "pk_Combined_Internet_Country" PRIMARY KEY (
        "country"
     )
);

ALTER TABLE "Country_Speed_Rank" ADD CONSTRAINT "fk_Country_Speed_Rank_country" FOREIGN KEY("country")
REFERENCES "Combined_Internet_Country" ("country");

ALTER TABLE "Country_Internet_Usage" ADD CONSTRAINT "fk_Country_Internet_Usage_country" FOREIGN KEY("country")
REFERENCES "Combined_Internet_Country" ("country");

ALTER TABLE "Country_ISO_3_Digit_Code" ADD CONSTRAINT "fk_Country_ISO_3_Digit_Code_country" FOREIGN KEY("country")
REFERENCES "Combined_Internet_Country" ("country");

ALTER TABLE "Country_population" ADD CONSTRAINT "fk_Country_population_country" FOREIGN KEY("country")
REFERENCES "Combined_Internet_Country" ("country");

create table Combined_Internet_Country as 
select a.country, countrycode, rank,
"download_speed_MBPS", "upload_speed_MBPS",
incomeperperson, internetusage, urbanrate, totpop
from
 "Country_Speed_Rank" a, 
 "Country_Internet_Usage" b ,
 "Country_ISO_3_Digit_Code" c,
 "Country_population" d
where a.country=b.country
and b.country=c.country
and c.country=d.country;
