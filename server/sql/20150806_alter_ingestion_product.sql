-- set the numshipdetected and numoilspill to numeric

ALTER TABLE ingestionproducts ALTER COLUMN numshipdetect TYPE integer USING (numshipdetect::integer);
ALTER TABLE ingestionproducts ALTER COLUMN numoilspill TYPE integer USING (numoilspill::integer);
