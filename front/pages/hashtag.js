import React, { useEffect } from "react";
import propTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { LOAD_HASHTAG_POSTS_REQUEST } from "../reducers/post";
import PostCard from "../components/PostCard";

const Hashtag = ({ tag }) => {
  //{tag}를 pageprops에서 가져옴
  const dispatch = useDispatch();
  const { mainPosts } = useSelector(state => state.post);

  useEffect(() => {
    dispatch({
      type: LOAD_HASHTAG_POSTS_REQUEST,
      data: tag
    });
  }, []);
  return (
    <div>
      {mainPosts.map(c => {
        <PostCard key={+c.createAt} post={c} />;
      })}
    </div>
  );
};

Hashtag.propTypes = {
  tag: propTypes.string.isRequired
};

Hashtag.getInitialProps = async context => {
  // _app.js에서 ctx로 넣어준 값을 여기서 context로 불러온다.
  console.log("hashtag getInitialProps", context.query.tag);
  return { tag: context.query.tag };
};

export default Hashtag;
