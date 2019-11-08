import React, { useEffect } from "react";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import { useSelector, useDispatch } from "react-redux";
import { LOAD_MAIN_POSTS_REQUEST } from "../reducers/post";

const Home = () => {
  const { me } = useSelector(state => state.user);
  const { mainPosts } = useSelector(state => state.post);
  const dispatch = useDispatch();
  console.log("--mainPosts--");
  console.log(mainPosts);

  useEffect(() => {
    dispatch({
      type: LOAD_MAIN_POSTS_REQUEST
    });
  }, []);

  return (
    <div>
      {me && <PostForm />}
      {mainPosts &&
        mainPosts.map(c => {
          return <PostCard key={c} post={c} />;
        })}
    </div>
  );
};

export default Home;
