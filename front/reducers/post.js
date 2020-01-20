import produce from "immer";

export const initialState = {
  mainPosts: [], // 화면에 보일 포스트
  userPosts: [], // 로그인한 유저의 포스트
  imagePaths: [], // 미리보기 이미지 경로
  isLoadingUserPost: false,
  addPostErrorReason: "",
  isAddingPost: false, // 포스트 업로드중
  postAdded: false,
  addCommnetErrorReason: "",
  isAddingComment: false,
  commentAdded: false,
  hasMorePost: false,
  hasMoreUserPost: false,
  onePost: ""
};

export const LOAD_MAIN_POSTS_REQUEST = "LOAD_MAIN_POSTS_REQUEST";
export const LOAD_MAIN_POSTS_SUCCESS = "LOAD_MAIN_POSTS_SUCCESS";
export const LOAD_MAIN_POSTS_FAILURE = "LOAD_MAIN_POSTS_FAILURE";

export const LOAD_HASHTAG_POSTS_REQUEST = "LOAD_HASHTAG_POSTS_REQUEST";
export const LOAD_HASHTAG_POSTS_SUCCESS = "LOAD_HASHTAG_POSTS_SUCCESS";
export const LOAD_HASHTAG_POSTS_FAILURE = "LOAD_HASHTAG_POSTS_FAILURE";

export const LOAD_USER_POSTS_REQUEST = "LOAD_USER_POSTS_REQUEST";
export const LOAD_USER_POSTS_SUCCESS = "LOAD_USER_POSTS_SUCCESS";
export const LOAD_USER_POSTS_FAILURE = "LOAD_USER_POSTS_FAILURE";

export const UPLOAD_IMAGES_REQUEST = "UPLOAD_IMAGES_REQUEST";
export const UPLOAD_IMAGES_SUCCESS = "UPLOAD_IMAGES_SUCCESS";
export const UPLOAD_IMAGES_FAILURE = "UPLOAD_IMAGES_FAILURE";

export const REMOVE_IMAGE = "REMOVE_IMAGE";

export const ADD_POST_REQUEST = "ADD_POST_REQUEST";
export const ADD_POST_SUCCESS = "ADD_POST_SUCCESS";
export const ADD_POST_FAILURE = "ADD_POST_FAILURE";

export const LIKE_POST_REQUEST = "LIKE_POST_REQUEST";
export const LIKE_POST_SUCCESS = "LIKE_POST_SUCCESS";
export const LIKE_POST_FAILURE = "LIKE_POST_FAILURE";

export const UNLIKE_POST_REQUEST = "UNLIKE_POST_REQUEST";
export const UNLIKE_POST_SUCCESS = "UNLIKE_POST_SUCCESS";
export const UNLIKE_POST_FAILURE = "UNLIKE_POST_FAILURE";

export const REMOVE_POST_REQUEST = "REMOVE_POST_REQUEST";
export const REMOVE_POST_SUCCESS = "REMOVE_POST_SUCCESS";
export const REMOVE_POST_FAILURE = "REMOVE_POST_FAILURE";

export const ADD_COMMENT_REQUEST = "ADD_COMMENT_REQUEST";
export const ADD_COMMENT_SUCCESS = "ADD_COMMENT_SUCCESS";
export const ADD_COMMENT_FAILURE = "ADD_COMMENT_FAILURE";

export const LOAD_POST_REQUEST = "LOAD_POST_REQUEST";
export const LOAD_POST_SUCCESS = "LOAD_POST_SUCCESS";
export const LOAD_POST_FAILURE = "LOAD_POST_FAILURE";

export const INIT_STATE_POST = "INIT_STATE_POST";

export default (state = initialState, action) => {
  return produce(state, draft => {
    switch (action.type) {
      case INIT_STATE_POST: {
        draft.imagePaths = [];
        draft.isAddingPost = false;
        draft.postAdded = false;
        draft.addPostErrorReason = false;
        draft.addCommnetErrorReason = false;
        draft.isAddingComment = false;
        draft.commentAdded = false;
        draft.onePost = "";
        break;
      }
      case LOAD_HASHTAG_POSTS_REQUEST:
      case LOAD_MAIN_POSTS_REQUEST: {
        draft.mainPosts = !action.lastId ? [] : draft.mainPosts;
        draft.hasMorePost = action.lastId ? draft.hasMorePost : true;
        break;
      }

      case LOAD_HASHTAG_POSTS_SUCCESS:
      case LOAD_MAIN_POSTS_SUCCESS: {
        action.data.forEach(d => {
          draft.mainPosts.push(d);
        });
        draft.hasMorePost = action.data.length === 10;
        break;
      }

      case LOAD_USER_POSTS_REQUEST: {
        draft.userPosts = !action.lastId ? [] : draft.mainPosts;
        draft.hasMoreUserPost = action.lastId ? draft.hasMoreUserPost : true;
        draft.isLoadingUserPost = false;
        break;
      }
      case LOAD_USER_POSTS_SUCCESS: {
        action.data.forEach(d => {
          draft.userPosts.push(d);
        });
        draft.hasMoreUserPost = action.data.length === 10;
        draft.isLoadingUserPost = true;
        break;
      }

      case LOAD_USER_POSTS_FAILURE: {
        draft.isLoadingUserPost = false;
        break;
      }
      case LOAD_HASHTAG_POSTS_FAILURE:
      case LOAD_MAIN_POSTS_FAILURE: {
        break;
      }

      case ADD_POST_REQUEST: {
        draft.isAddingPost = true;
        draft.addPostErrorReason = "";
        draft.postAdded = false;
        break;
      }
      case ADD_POST_SUCCESS: {
        draft.isAddingPost = false;
        draft.mainPosts.unshift(action.data);
        draft.postAdded = true;
        draft.addPostErrorReason = "";
        break;
      }
      case ADD_POST_FAILURE: {
        draft.isAddingPost = false;
        draft.addPostErrorReason = action.error;
        draft.postAdded = false;
        break;
      }

      case UPLOAD_IMAGES_REQUEST: {
        break;
      }
      case UPLOAD_IMAGES_SUCCESS: {
        action.data.forEach(p => {
          draft.imagePaths.push(p);
        });
        break;
      }
      case UPLOAD_IMAGES_FAILURE: {
        break;
      }

      case ADD_COMMENT_REQUEST: {
        draft.isAddingComment = true;
        draft.addCommnetErrorReason = "";
        draft.commentAdded = false;
        break;
      }
      case ADD_COMMENT_SUCCESS: {
        const postIndex = draft.mainPosts.findIndex(
          v => v.id === action.data.postId
        );
        draft.mainPosts[postIndex].Comments.push(action.data.comment);
        draft.isAddingComment = false;
        draft.commentAdded = true;
        draft.addCommnetErrorReason = "";
        break;
      }
      case ADD_COMMENT_FAILURE: {
        draft.isAddingComment = false;
        draft.addCommnetErrorReason = action.error;
        break;
      }

      case REMOVE_IMAGE: {
        const index = draft.imagePaths.findIndex((v, i) => i === action.index);
        draft.imagePaths.splice(index, 1);
        break;
      }

      case LIKE_POST_REQUEST: {
        break;
      }
      case LIKE_POST_SUCCESS: {
        const postIndex = draft.mainPosts.findIndex(
          v => v.id === action.data.postId
        );
        draft.mainPosts[postIndex].Likers.unshift({ id: action.data.userId });
        break;
      }
      case LIKE_POST_FAILURE: {
        break;
      }
      case UNLIKE_POST_REQUEST: {
        break;
      }
      case UNLIKE_POST_SUCCESS: {
        const postIndex = draft.mainPosts.findIndex(
          v => v.id === action.data.postId
        );
        const likeIndex = draft.mainPosts[postIndex].Likers.findIndex(
          v => v.id === action.data.userId
        );
        draft.mainPosts[postIndex].Likers.splice(likeIndex, 1);
        break;
      }
      case UNLIKE_POST_FAILURE: {
        break;
      }

      case REMOVE_POST_REQUEST: {
        break;
      }
      case REMOVE_POST_SUCCESS: {
        const index = draft.mainPosts.findIndex(v => v.id === action.data);
        draft.mainPosts.splice(index, 1);
        break;
      }
      case REMOVE_POST_FAILURE: {
        break;
      }

      case LOAD_POST_REQUEST: {
        draft.onePost = "";
        break;
      }
      case LOAD_POST_SUCCESS: {
        draft.onePost = action.data;
        break;
      }
      case LOAD_POST_FAILURE: {
        draft.onePost = "";
        break;
      }

      default: {
        break;
      }
    }
  });
};
