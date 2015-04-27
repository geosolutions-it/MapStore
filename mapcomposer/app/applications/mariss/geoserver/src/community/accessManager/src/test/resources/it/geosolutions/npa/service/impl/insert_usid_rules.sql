-- 113 is a valid FID in cite:Buildings layer, which is part of the default test data package
DELETE FROM role_usid;
INSERT INTO role_usid (role, usid)  VALUES ('ROLE_ACCESS', '113'); 
