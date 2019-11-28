import React, { useEffect } from "react";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import { useSelector, useDispatch } from "react-redux";
import { LOAD_MAIN_POSTS_REQUEST } from "../reducers/post";

const Home = () => {
  const { me } = useSelector(state => state.user);
  const { mainPosts } = useSelector(state => state.post);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: LOAD_MAIN_POSTS_REQUEST
    });
  }, []);

  (() => {
    mainPosts.map(c => {
      // return console.log(c);
    });
  })();

  return (
    <div>
      {me && <PostForm />}
      {mainPosts &&
        mainPosts.map(c => {
          return <PostCard key={c.id} post={c} />;
        })}
    </div>
  );
};

export default Home;
