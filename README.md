# 마음연구소
## 응시자 박주현
## 목차

  * [프로젝트 진행사항](#프로젝트-진행사항)
  * [요구사항 구현](#요구사항-구현)
  * [Test 결과](#test-결과)
  * [실행 및 테스트 방법](#실행-및-테스트-방법)


## 프로젝트 진행사항
- 유저
    - [x] 회원가입 
    - [x] 로그인
    - [x] 회원 정보 수정
    - [x] 회원 탈퇴
- 게시판
    - [x] 게시글 작성
    - [x] 게시글 확인
    - [x] 게시글 검색
    - [x] 게시글 삭제
    - [x] 내가 쓴 글 확인
    - [x] 게시판 댓글 및 대댓글

- 에러 처리
    - [x] 요청 실패 시 적절한 에러를 리턴해야 합니다.
    - [x] 에러 응답에 제한은 없지만 일관되게 응답해야 합니다.

- 로그
    - [x] 에러 및 특이사항 발생시 로그를 확인하여 대처할 수 있게 작성
- 기타
    - [x] 주석 작성
    - [x] 유닛테스트코드 작성

## 요구사항 구현
### 사용 기술
- typescript
- node
- nest.js
- graphql
- typeorm
- postgresql
- 그 외 다른 라이브러리 사용

### 회원가입
```
파라미터
  - email
  - password
  - nickname
  
유효성 검사
  - email: 이메일 형식, db에 같은 email이 존재하는지 확인(유일한 값을 가져야함)
  - password: 최소 6자
  - nickname : 4 ~ 20자, db에 같은 nickname 존재하는지 확인(유일한 값을 가져야함)
  
결과 값
  - id, email, nickname
```

### 로그인
```
파라미터
  - email
  - password
  
유효성 검사
  - title: 이메일 형식
  - password: 최소 6자
  
결과 값
  - jwt 토큰 값
```

### 회원 정보 수정
```
파라미터
  - email
  - password
  - nickname
  
유효성 검사
  - email: 이메일 형식, db에 같은 email이 존재하는지 확인(유일한 값을 가져야함)
  - password: 최소 6자
  - nickname : 4 ~ 20자, db에 같은 nickname 존재하는지 확인(유일한 값을 가져야함)
  
결과 값
  - 수정된 유저 
```
 
### 회원 탈퇴
```
파라미터
  - 없음
  
유효성 검사
  - 없음
  
결과 값
  - 삭제 성공 여부(boolean 값)
```

### 게시글 작성
```
파라미터
  - title
  - content
  
유효성 검사
  - title : 최대 100자
  - content : 최대 1000자
  
결과 값
  - 생성된 게시글 정보
```

### 게시글 확인
```
파라미터
  - postId
  
유효성 검사
  - 없음

  
결과 값
  - 게시글 정보
```

### 게시글 검색
```
파라미터
  - postTitle
  
유효성 검사
  - 없음

  
결과 값
  - 제목에 postTitle가 포함된 게시글 리스트
```

### 게시글 삭제
```
파라미터
  - postId
  
유효성 검사
  - 없음

  
결과 값
  - 삭제 성공 여부(boolean 값)
```

### 내가 쓴 글 확인
```
파라미터
  - 없음
  
유효성 검사
  - 없음

  
결과 값
  - 로그인된 유저가 작성한 게시글 리스트 
```

### 댓글 및 대댓글 생성
```
파라미터
  - postId
  - content
  - parentCommentId(대댓글일 때 사용)
  
유효성 검사
  - content: 최대 1000자

  
결과 값
  - 생성된 댓글  
```

### 댓글 및 대댓글 수정
```
파라미터
  - commentId
  - content
  
유효성 검사
  - content: 최대 1000자

  
결과 값
  - 수정된 댓글  
```

### 댓글 및 대댓글 삭제
```
파라미터
  - commentId
  
유효성 검사
 - 없음
  
결과 값
  - 삭제 성공 여부(boolean 값)
```

## test-결과
### 유닛 테스트 진행
<img src="https://user-images.githubusercontent.com/70467297/210531456-f1e13678-d3d9-47e4-a431-1385c36f1ec4.png"   height="300"/>


## 실행 및 테스트 방법
### 프로젝트 설치 밀 실행 과정
<b>1. 프로젝트 clone 및 디렉토리 이동</b>
```
git clone https://github.com/Zero-Human/maum.git
```
<b>2. .env 파일 생성</b>
```
DB_USER=
DB_PASSWORD=
DB_PORT=
DB_HOST=
DB_SCHEMA=
SYNCHRONIZE = 
LOGGING = 
SECRET_KEY = 
EXPIRES_IN =
```
<b>3. node package 설치</b>
```
npm install
```
<b>4. 서버 실행</b>
```
npm run start
```

<b>4. 동작 확인</b>
```
http://localhost:4000/graphql
```

### 테스트 방법
설치 및 셋팅 완료 후 진행<br>
<b>1. 테스트 실행</b>
```
npm run test
```

