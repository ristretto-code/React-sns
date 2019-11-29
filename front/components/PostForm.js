import React, { useCallback, useState, useEffect, useRef } from "react";
import { Input, Form, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  ADD_POST_REQUEST,
  UPLOAD_IMAGES_REQUEST,
  REMOVE_IMAGE
} from "../reducers/post";

const PostForm = () => {
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const { imagePaths, isAddingPost, postAdded } = useSelector(
    state => state.post
  );
  const imageInput = useRef();

  useEffect(() => {
    setText("");
  }, [postAdded === true]);

  const onSubmitForm = useCallback(
    e => {
      e.preventDefault();
      // props로 들어가는 함수는 무조건 useCallback
      if (!text || !text.trim()) {
        return alert("게시글을 작성하세요"); // 리턴으로 함수끊기
      }
      const formData = new FormData();
      imagePaths.forEasch(i => {
        formData.append("image", i);
      });
      formData.append("content", text);
      dispatch({
        type: ADD_POST_REQUEST,
        data: {
          content: text,
          data: formData
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
    imageInput.current.click(); // 버튼누르면 useRef로 file이 눌러짐
  }, [imageInput.current]);

  const onRemoveImage = useCallback(index => () => {
    dispatch({
      type: REMOVE_IMAGE,
      index
    });
  });

  return (
    <Form
      style={{ marginTop: "10px 0 20px 0" }}
      encType="multipart/form-data"
      onSubmit={onSubmitForm}
    >
      <Input.TextArea
        maxLength={140}
        placeholder="어떤 신기한 일이 있을까"
        value={text}
        onChange={onChangeText}
      />
      <div>
        <input
          type="file"
          multiple
          hidden
          ref={imageInput}
          onChange={onChangeImages}
        />{" "}
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button
          type="primary"
          style={{ float: "right" }}
          htmlType="submit"
          loading={isAddingPost}
        >
          짹짹
        </Button>
      </div>
      <div>
        {imagePaths !== undefined
          ? imagePaths.map((v, i) => {
              return (
                <div key={v} style={{ display: "inline-block" }}>
                  <img
                    src={`http://localhost:8080/${v}`}
                    style={{ width: "200px" }}
                    alt={v}
                  />
                  <div>
                    <Button onClick={onRemoveImage(i)}>제거</Button>
                  </div>
                </div>
              );
            })
          : "아무것도 없었다"}
      </div>
    </Form>
  );
};

export default PostForm;
