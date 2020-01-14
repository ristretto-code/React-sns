import { Modal } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { ADD_COMMENT_REQUEST } from "../reducers/post";
import styled from "styled-components";

const InputWrapper = styled.div`
  width: 100%;
  & input {
    display: inline-block;
    width: 90%;
    padding: 15px 10px;
    border: none;
    outline: none;
    ::placeholder {
      color: #ced4da;
    }
  }
  & div {
    display: inline-block;
    width: 10%;
    color: #339af0;
    font-weight: 600;
    text-align: center;
    cursor: pointer;
  }
`;

const CommentForm = ({ post }) => {
  const [commentText, setCommentText] = useState("");
  const { commentAdded, isAddingComment } = useSelector(state => state.post);
  const { me } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const error = errormsg => {
    Modal.error({
      title: "에러 메세지",
      content: errormsg
    });
  };

  const onSubmitComment = useCallback(() => {
    if (!me) {
      return error("로그인이 필요합니다.");
    }
    if (commentText.length < 1) {
      return error("댓글을 입력해주세요");
    }
    return dispatch({
      type: ADD_COMMENT_REQUEST,
      data: {
        postId: post.id,
        content: commentText
      }
    });
  }, [me && me.id, commentText]);

  useEffect(() => {
    setCommentText("");
  }, [commentAdded === true]);

  const onChangeCommentText = useCallback(e => {
    setCommentText(e.target.value);
  }, []);

  return (
    <InputWrapper>
      <input
        type="text"
        value={commentText}
        onChange={onChangeCommentText}
        placeholder="Add a comment..."
      />
      <div onClick={onSubmitComment}>게시</div>
    </InputWrapper>
  );
};

CommentForm.propTypes = {
  post: PropTypes.object.isRequired
};

export default CommentForm;
