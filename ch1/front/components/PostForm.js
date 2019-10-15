import React from "react";
import { Input, Form, Button } from "antd";

const dummy = {
  Nickname: "IANCHOI",
  Post: [],
  Followings: [],
  Followers: [],
  isLoggedIn: true,
  imagePaths: [],
  mainPosts: [
    {
      User: {
        id: 1,
        nickname: "철웅"
      },
      content: "첫번째 게시글",
      img:
        "https://images.unsplash.com/photo-1571072000982-f2ac1c89237d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80"
    }
  ]
};

const PostForm = () => {
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
        {dummy.imagePaths.map((v, i) => {
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
