import { all, fork, takeLatest, put, call } from "redux-saga/effects";
import {
  LOAD_MAIN_POSTS_REQUEST,
  LOAD_MAIN_POSTS_SUCCESS,
  LOAD_MAIN_POSTS_FAILURE,
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  ADD_POST_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_COMMENT_FAILURE
} from "../reducers/post";
import axios from "axios";

function* loadMainPostsApi() {
  return axios.get("/posts");
}
function* loadMainPosts() {
  try {
    const result = yield call(loadMainPostsApi);
    console.log("불러온 게시글--result");
    console.log(result);
    console.log("불러온 게시글--result.data");
    console.log(result.data);
    yield put({
      type: LOAD_MAIN_POSTS_SUCCESS,
      data: result.data
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_MAIN_POSTS_FAILURE,
      error: e
    });
  }
}
function* watchLoadMainPosts() {
  yield takeLatest(LOAD_MAIN_POSTS_REQUEST, loadMainPosts);
}

function* addPostApi(postData) {
  return axios.post("/post", postData, {
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
    console.error(e);
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
  yield all([
    fork(watchAddPost),
    fork(watchAddComment),
    fork(watchLoadMainPosts)
  ]);
}
