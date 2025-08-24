This is a Chat_app




 두 서버 코드를 하나로 통합함 

받아온 서버의 API (auth, products, emailAuth, GCP Vision 등) 유지

내 서버의 채팅 기능 + Socket.io + DB 연결 유지

React SPA 빌드 

CORS, 세션 등 공통 설정 충돌 방지

기존 testdata디비랑 chatdb를 imgdb로 통합하였음 

☑️ imgdb구조
imgdb_sql 폴더 
├─ 01_create_db.sql           # DB 생성 및 선택
├─ 02_create_tables.sql       # 모든 테이블 생성 (category, keyword, test_user, test_products, users)
├─ 03_insert_category.sql     # category 데이터
├─ 04_insert_keyword.sql      # keyword 데이터
├─ 05_insert_test_user.sql    # test_user 데이터
├─ 06_insert_test_products.sql # test_products 데이터
├─ 07_insert_users.sql        # 서비스용 users 데이터

💡 실행 순서 꼭 지키기!!

01_create_db.sql

02_create_tables.sql  // 혹시 insert 된 데이터에 구데이터 오류나면, 2번까지만 실행해도 ok 

03_insert_category.sql 

04_insert_keyword.sql

05_insert_test_user.sql

06_insert_test_products.sql

07_insert_users.sql

이 순서대로 실행하면 외래키 제약도 안전하게 통과하면서 DB가 완전히 초기화됩니다.
