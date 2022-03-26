CREATE TABLE coins (
    userId VARCHAR(100) NOT NULL PRIMARY KEY,
    guildId VARCHAR(100) NOT NULL,
    coins FLOAT(50,2) NOT NULL DEFAULT 0
)

CREATE TABLE inventory (
    userId VARCHAR(100) NOT NULL PRIMARY KEY,
    guildId VARCHAR(100) NOT NULL,
    inventory LONGTEXT DEFAULT('{"items":[{"name":"Pain","quantity":5, "id":"bread", "type":"food"}],"armor":[{"name":"Casque","type":"none","health":100,"id":"helmet"},{"name":"Plastron","type":"none","health":100,"id":"chest"},{"id":"jambe","name":"Jambière","type":"none","health":100},{"id":"boots","name":"Botte","type":"none","health":100}],"alter":[{"name":"none","type":"none","id":"none"}]}')
);
CREATE TABLE player (
    userId VARCHAR(100) NOT NULL PRIMARY KEY,
    guildId VARCHAR(100) NOT NULL,
    information LONGTEXT DEFAULT ('{"health":100,"food":100}')
);

CREATE TABLE alters(
   userId VARCHAR(100) NOT NULL PRIMARY KEY,
   guildId VARCHAR(100) NOT NULL,
   alterInformation LONGTEXT DEFAULT ('{"name":"none","type":"none", "id":"none"}')
);