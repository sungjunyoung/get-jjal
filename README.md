# 겟짤

## [DEMO](http://jjals.teamsixhours.com)

## INSTALL
```
git clone https://github.com/sungjunyoung/get-jjal.git
npm install
npm run build
```

## DEVELOP
#### BACKEND
```
node server
```
> apis 안의 js 파일 참고하여 API 구성

#### FRONTEND
```
npm start
```

#### ADD CONFIG FILES

`/config` 폴더 생성 후 내부에 `mysql.json` 파일 생성
```json
{
  "host": "HOST",
  "user": "USER",
  "password": "PASSWORD",
  "database": "get-jjal"
}
```
