import { all, fork, takeLatest, call, put, take } from "redux-saga/effects";
import { LOG_IN, LOG_IN_SUCCESS, LOG_IN_FAILURE } from "../reducers/user";

const HELLO_SAGA = "HELLO_SAGA";

function loginAPI() {
  //서버에 요청을 보내는 부분
}

function* login() {
  try {
    yield call(loginAPI); // loginAPI가 성공하면 다음줄 실행
    yield put({
      //put은 dispatch와 동일
      type: LOG_IN_SUCCESS
    });
  } catch (e) {
    // loginAPI가 실패
    console.log("로그인 API 불러오지 못했음");
    console.error(e);
    yield put({
      // LOG_IN_FAILURE 실행됨
      type: LOG_IN_FAILURE
    });
  }
}

function* watchLogin() {
  yield takeLatest(LOG_IN, login);
  // LOG_IN 액션이 들어오나 지켜보다가 들어오면 login* 실행
}

function* watchHello() {
  console.log("before saga");
  while (true) {
    yield take(HELLO_SAGA);
    console.log("after saga");
  }
}

export default function* userSaga() {
  yield all([watchHello(), watchLogin()]);
}
