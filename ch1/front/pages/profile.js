import React from "react";
import { Input, Button, List, Form } from "antd";

const Profile = () => {
  return (
    <div>
      <Form
        style={{
          marginBottom: "20px",
          border: "1px solid #d9d9d9",
          padding: "20px"
        }}
      >
        <Input addonBefore="닉네임" />
        <Button type="primary">수정</Button>
      </Form>
      <List />
    </div>
  );
};

export default Profile;
