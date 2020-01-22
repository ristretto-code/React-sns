import React from "react";
import { useSelector } from "react-redux";
import Helmet from "react-helmet";
import propTypes from "prop-types";
import PostCard from "../components/PostCard";
import { Icon } from "antd";

import { LOAD_POST_REQUEST } from "../reducers/post";

const Post = ({ id }) => {
  const { onePost, isloadingOnePost } = useSelector(state => state.post);
  return (
    <>
      {isloadingOnePost ? (
        <>
          <Helmet
            title={`${onePost.User.nickname}님의 글`}
            description={`${onePost.content}`}
            meta={[
              {
                name: "description",
                content: onePost.content
              },
              {
                property: "og:title",
                content: `${onePost.User.nickname}님의 게시물`
              },
              { property: "og:description", content: onePost.content },
              {
                property: "og:image",
                content: onePost.Images[0]
                  ? onePost.Images[0].src
                  : require("../public/logo.png")
              },
              {
                property: "og:url",
                content: `http://reactsns.net/post/${id}`
              }
            ]}
          />

          <PostCard key={onePost.id} post={onePost} />
        </>
      ) : (
        <div style={{ width: "100%", textAlign: "center" }}>
          <Icon style={{ fontSize: "50px" }} type="loading" />
        </div>
      )}
    </>
  );
};

Post.getInitialProps = async context => {
  context.store.dispatch({
    type: LOAD_POST_REQUEST,
    data: context.query.id
  });
  return { id: parseInt(context.query.id, 10) };
};

Post.propTypes = {
  id: propTypes.number.isRequired
};

export default Post;
