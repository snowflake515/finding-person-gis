CREATE TABLE your_table_name (
    uid SERIAL PRIMARY KEY,
    userid VARCHAR(100),
    username VARCHAR(100),
    type VARCHAR(100),
    geom GEOMETRY(Point, 4326) -- Point geometry with SRID 4326 (WGS 84)
);