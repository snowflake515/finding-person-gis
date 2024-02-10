-- Assuming the `locations` table already exists with a geometry column `geom`
INSERT INTO profiles (userid, username, type, geom) VALUES ('admin', 'ander', 'dev' ,ST_SetSRID(ST_MakePoint(-74.0059, 40.7128), 4326));
