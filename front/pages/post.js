import React from "react";
import { useSelector } from "react-redux";
import Helmet from "react-helmet";

import { LOAD_POST_REQUEST } from "../reducers/post";

const Post = () => {
  const { onePost } = useSelector(state => state.post);
  return (
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
            content:
              onePost.Images[0] &&
              `http://localhost:3000/${onePost.Images[0].src}`
          },
          {
            property: "og:url",
            content: `http://localhost:3000/post/${onePost.id}`
          }
        ]}
      />
      <div> {onePost.id} </div>
      <div> {onePost.content} </div>
      <div> {onePost.User.nickname} </div>
      <div>
        {onePost.Images && (
          <img src={`http://localhost:8080/${onePost.Images[0].src}`} />
        )}
      </div>
    </>
  );
};

Post.getInitialProps = context => {
  context.store.dispatch({
    type: LOAD_POST_REQUEST,
    data: context.query.id
  });
  return { id: parseInt(context.query.id, 10) };
};

export default Post;
