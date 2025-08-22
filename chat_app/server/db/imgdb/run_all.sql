

-- run_all.sql 파일설명 : imgdb를 생성할 수 있도록 sql 파일 경로 모음 

--  imgdb 생성방법 

-- 1. 터미널경로 imgdb 폴더로 맞춘 후, ( tip : 파일이나 폴더 우클릭 하면 경로 복사 가능 )

-- 2. mysql 접속하고 아래 명령어 실행하면 sql 파일들 한번에 등록 됨 

-- SOURCE run_all.sql 



SOURCE create_db.sql;
SOURCE create_tables.sql;
SOURCE insert_category.sql;
SOURCE insert_keyword.sql;
SOURCE insert_products.sql; -- 누락 확인함 (완료)

-- 테스트용 필요시 주석 해제
-- SOURCE insert_test_user.sql;
-- SOURCE insert_test_products.sql;
-- SOURCE insert_users.sql;