import { all, fork, takeLatest, delay, put } from "redux-saga/effects";
import {
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  ADD_POST_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_COMMENT_FAILURE
} from "../reducers/post";
import axios from "axios";

function* addPostApi(postData) {
  return axios.post("/post/", postData, {
    withCredentials: true // 로그인한사람만 쓸수있도록 쿠키보내서 로그인했는지 안했는지 인증
  });
}
function* addPost(action) {
  try {
    const result = yield call(addPostApi, action.data);
    console.log("-- addpost result--");
    console.log(result);
    yield put({
      type: ADD_POST_SUCCESS,
      data: result.data
    });
  } catch (e) {
    yield put({
      type: ADD_POST_FAILURE,
      error: e
    });
  }
}
function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}

function* addCommentApi() {}
function* addComment(action) {
  try {
    yield delay(2000);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: {
        postId: action.data.postId
      }
    });
  } catch (e) {
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: e
    });
  }
}
function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

export default function* userSaga() {
  yield all([fork(watchAddPost), fork(watchAddComment)]);
}
