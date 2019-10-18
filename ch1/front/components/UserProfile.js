import React from "react";
import { Card, Avatar } from "antd";
import { useSelector } from "react-redux";

const UserProfile = () => {
  const { user } = useSelector(state => state.user);
  return (
    <Card
      actions={[
        <div key="twit">
          짹짹
          <br />
          {user.Post.length}
        </div>,
        <div key="followings">
          팔로잉
          <br />
          {user.Followings.length}
        </div>,
        <div key="followers">
          팔로워
          <br />
          {user.Followers.length}
        </div>
      ]}
    >
      <Card.Meta
        avatar={<Avatar>{user.Nickname[0]}</Avatar>}
        title={Nickname}
      />
    </Card>
  );
};

export default UserProfile;
