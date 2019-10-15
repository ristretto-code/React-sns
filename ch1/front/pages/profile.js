import React from "react";
import { Icon, Button, List, Card } from "antd";
import NicknameEditForm from "../components/NicknameEditForm";

const Profile = () => {
  return (
    <div>
      <NicknameEditForm />
      <List
        style={{ marginBottom: "20px" }}
        grid={{ gutter: 4, xs: 2, md: 3 }}
        size="small"
        header={<div>팔로워목록</div>}
        loadMore={<Button style={{ width: "100%" }}>더보기</Button>}
        bordered
        dataSource={["철웅", "천재", "오피셜임"]}
        renderItem={item => (
          <List.Item style={{ marginTop: "20px" }}>
            <Card actions={[<Icon type="stop" />]}>
              <Card.Meta description={item} />
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Profile;
