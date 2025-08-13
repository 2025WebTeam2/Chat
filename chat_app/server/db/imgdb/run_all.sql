
-- 필독 !!!!!!!!!!! imgdb 생성방법 
-- 터미널경로 imgdb 폴더로 맞춘 후, 
-- mysql 접속하고 아래 명령어 실행하면 sql 파일들 한번에 등록 됨 
-- SOURCE run_all.sql 
-- run_all.sql 파일설명 : sql 파일 경로 모아둠 
-- tip : 파일이나 폴더 우클릭 하면 경로 복사 가능 

SOURCE create_db.sql;
SOURCE create_tables.sql;
SOURCE insert_category.sql;
SOURCE insert_keyword.sql;
SOURCE insert_test_user.sql;
SOURCE insert_test_products.sql;
SOURCE insert_users.sql;