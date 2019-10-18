import React from "react";
import { Input, Form, Button } from "antd";
import { useSelector } from "react-redux";

const PostForm = () => {
  // const { user } = useSelector(state => state.user);
  // const { mainPosts } = useSelector(state => state.mainPosts);
  const { imagePaths } = useSelector(state => state.imagePaths);
  return (
    <Form style={{ marginTop: "10px 0 20px 0" }} encType="multipart/form-data">
      <Input.TextArea maxLength={140} placeholder="어떤 신기한 일이 있을까" />
      <div>
        <input type="file" multiple hidden /> <Button>이미지 업로드</Button>
        <Button type="primary" style={{ float: "right" }} htmlType="submit">
          짹짹
        </Button>
      </div>
      <div>
        {imagePaths.map((v, i) => {
          return (
            <div key={v} style={{ display: "inline-block" }}>
              <img
                src={"http://localhost:3065/" + v}
                style={{ width: "200px" }}
                alt={v}
              />
              <div>
                <Button>제거</Button>
              </div>
            </div>
          );
        })}
      </div>
    </Form>
  );
};

export default PostForm;
