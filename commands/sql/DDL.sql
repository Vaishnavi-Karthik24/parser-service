-- Modifying table columns
ALTER TABLE table_name ADD COLUMN new_column varchar(20) DEFAULT NULL AFTER existing_column;

-- Deleting the table
DROP TABLE table_name;

-- Deleting data from the table
DELETE FROM table_name;

-- Inserting data into the table
INSERT INTO table_name (column_one, column_two, column_three) VALUES ('', '', '');

-- Updating column value in the table
UPDATE table_name SET column_one = '', column_two = '' where column_three = '0;' 

-- Fetching values from the table
SELECT * FROM table_name where column_name = '' and column_three in ('test', 'testing') and column_two like 'test%' GROUP BY column_name ORDER BY column_name desc LIMIT 100;

-- Fetching values from the table by grouping the values to avoid duplicates
SELECT DISTINCT column_name FROM table_name where column_name = '';

-- Getting count of the values presnt
SELECT COUNT(*) FROM table_name;

-- Converting based on timezone
SELECT CONVERT_TZ(CURRENT_TIMESTAMP(), @@global.time_zone, tn.column_name) as time_stamp;

-- Timestamp Query
SELECT CURRENT_TIMESTAMP();

SELECT CURDATE();

SELECT CURRENT_DATE();

SELECT NOW();

-- Between some interval of day
SELECT * FROM table_name WHERE created_ts BETWEEN NOW() - INTERVAL 30 DAY AND NOW(); 

-- Adding case and joins
SELECT
tn1.column_two AS one, 
tn1.column_two AS two 
CASE 
    WHEN tn1.column_one = 'test' 
    THEN tn2.column_three 
    ELSE null 
END AS three 
IF (tn3.column_one IS NULL, 'SUCCESS', 'FAILURE') AS four
FROM table_name1 tn1
INNER JOIN table_name2 tn2 ON tn2.column_name = tn1.column_name
LEFT JOIN table_name3 tn3 ON tn3.column_name = tn2.column_name
JOIN table_name2 tn2 ON tn2.column_name = tn1.column_name;

-- Calling store procedure
CALL store_procedure_name('valueIfAny');