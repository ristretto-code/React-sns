import React from "react";
import { Avatar, Card, Icon } from "antd";
import proptypes from "prop-types";

const PostCard = ({ post }) => {
  return (
    <Card
      key={+post.createdAt}
      cover={
        post.img && (
          <img
            alt="example"
            src={post.img}
            style={{ width: "100%", height: "100%" }}
          />
        )
      }
      actions={[
        <Icon type="retweet" key="retweet" />,
        <Icon type="heart" key="heart" />,
        <Icon type="message" key="message" />,
        <Icon type="ellipsis" key="ellipsis" />
      ]}
      // extra={}
    >
      <Card.Meta
        avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
        title={post.User.nickname}
        description={post.content}
      />
    </Card>
  );
};

PostCard.proptypes = {
  post: proptypes.shape({
    User: proptypes.object,
    content: proptypes.string,
    img: proptypes.string,
    createdAt: proptypes.object
  })
};

export default PostCard;
