import React, { useCallback, useState, useEffect, useRef } from "react";
import { Input, Form, Button, Row, Col, Modal } from "antd";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import Router from "next/router";
import {
  ADD_POST_REQUEST,
  UPLOAD_IMAGES_REQUEST,
  REMOVE_IMAGE
} from "../reducers/post";
import styled from "styled-components";

const PostUpContainer = styled.div`
  border: 2px solid #ebedf0;
  border-radius: 3px;
  background-color: #ffffff;
`;

const PostUpHeader = styled.div`
  padding: 10px;
  background-color: #f5f6f7;
  font-weight: 600;
`;

const PostUpInputWrapper = styled.div`
  margin-bottom: 5px;
  max-width: 100vw;
  max-height: 50vh;
`;
const PostUpButtonWrapper = styled.div`
  margin-bottom: 5px;
  max-width: 100vw;
  & button {
    margin: 5px;
  }
  & div {
    float: right;
  }
`;

const PostUpImageWrapper = styled.div`
  max-width: 100vw;
  max-height: 30vh;
  overflow-x: auto;
  overflow-y: none;
  white-space: nowrap;
  background-color: #f5f6f7;
`;

const error = errormsg => {
  Modal.error({
    title: "에러 메세지",
    content: errormsg
  });
};

const PostForm = () => {
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const { imagePaths, isAddingPost, postAdded } = useSelector(
    state => state.post
  );
  const imageInput = useRef();

  useEffect(() => {
    if (postAdded === true) {
      setText("");
      Router.push("/");
    }
  }, [postAdded]);

  const onSubmitForm = useCallback(
    e => {
      e.preventDefault();
      if (!text || !text.trim()) {
        return error("게시글을 작성하세요");
      }
      dispatch({
        type: ADD_POST_REQUEST,
        data: {
          content: text,
          image: imagePaths
        }
      });
    },
    [text, imagePaths]
  );
  const onChangeText = useCallback(e => {
    setText(e.target.value);
  }, []);

  const onChangeImages = useCallback(e => {
    console.log(e.target.files);
    const imageFormData = new FormData();
    [].forEach.call(e.target.files, f => {
      imageFormData.append("image", f);
    });
    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData
    });
  }, []);

  const onClickImageUpload = useCallback(() => {
    imageInput.current.click(); // 버튼 클릭시 useRef로 file 클릭
  }, [imageInput.current]);

  const onRemoveImage = useCallback(index => () => {
    dispatch({
      type: REMOVE_IMAGE,
      index
    });
  });

  return (
    <Row type="flex" justify="center">
      <Col xs={24} md={16}>
        <PostUpContainer>
          <PostUpHeader>Create Post</PostUpHeader>
          <Form encType="multipart/form-data" onSubmit={onSubmitForm}>
            <PostUpInputWrapper>
              <Input.TextArea
                maxLength={300}
                placeholder="Write a post..."
                value={text}
                onChange={onChangeText}
                style={{ width: "100vw", height: "200px" }}
              />
            </PostUpInputWrapper>
            <PostUpButtonWrapper>
              <input
                type="file"
                multiple
                hidden
                ref={imageInput}
                onChange={onChangeImages}
              />
              <Button icon="picture" onClick={onClickImageUpload}>
                Photo
              </Button>
              <div>
                <Link href="/">
                  <a>
                    <Button>Cancel</Button>
                  </a>
                </Link>
                <Button type="primary" htmlType="submit" loading={isAddingPost}>
                  Post
                </Button>
              </div>
            </PostUpButtonWrapper>
            <PostUpImageWrapper>
              {imagePaths !== undefined
                ? imagePaths.map((v, i) => {
                    return (
                      <div
                        key={i}
                        style={{
                          display: "inline-block",
                          margin: "10px 10px 10px 0",
                          width: "130px",
                          height: "130px",
                          background: `no-repeat url("//localhost:8080/${v}")`,
                          backgroundSize: "cover",
                          backgroundPosition: "center"
                        }}
                      >
                        <div>
                          <Button
                            icon="close"
                            onClick={onRemoveImage(i)}
                            style={{ float: "right", margin: "2px" }}
                          ></Button>
                        </div>
                      </div>
                    );
                  })
                : "Images not found"}
            </PostUpImageWrapper>
          </Form>
        </PostUpContainer>
      </Col>
    </Row>
  );
};

export default PostForm;
