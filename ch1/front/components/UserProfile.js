import React from "react";
import { Card, Avatar } from "antd";

const dummy = {
  Nickname: "IANCHOI",
  Post: [],
  Followings: [],
  Followers: [],
  isLoggedIn: true
};

const UserProfile = () => {
  return (
    <Card
      actions={[
        <div key="twit">
          짹짹
          <br />
          {dummy.Post.length}
        </div>,
        <div key="followings">
          팔로잉
          <br />
          {dummy.Followings.length}
        </div>,
        <div key="followers">
          팔로워
          <br />
          {dummy.Followers.length}
        </div>
      ]}
    >
      <Card.Meta
        avatar={<Avatar>{dummy.Nickname[0]}</Avatar>}
        title={dummy.Nickname}
      />
    </Card>
  );
};

export default UserProfile;
