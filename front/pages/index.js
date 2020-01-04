import React, { useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import PostCard from "../components/PostCard";
import LoginForm from "../components/LoginForm";
import UserProfile from "../components/UserProfile";
import { useSelector, useDispatch } from "react-redux";
import { Layout, Input, Button, Row, Col, Affix, Icon, Menu } from "antd";
import {
  LOAD_MAIN_POSTS_REQUEST,
  LOAD_USER_POSTS_REQUEST
} from "../reducers/post";
import styled from "styled-components";

const ProfileWrapper = styled.div`
  margin: 0 8%;
`;

const CopyRight = styled.div`
  height: 300px;
  text-align: center;
  vertical-align: middle;
  color: #fafafa;
`;

const Home = () => {
  const { me } = useSelector(state => state.user);
  const { mainPosts, hasMorePost } = useSelector(state => state.post);
  const dispatch = useDispatch();
  const countRef = useRef([]);

  const onScroll = useCallback(() => {
    if (
      window.scrollY + document.documentElement.clientHeight >
      document.documentElement.scrollHeight - 300
    ) {
      if (hasMorePost) {
        const lastId = mainPosts[mainPosts.length - 1].id;
        if (!countRef.current.includes(lastId)) {
          dispatch({
            type: LOAD_MAIN_POSTS_REQUEST,
            lastId: lastId
          });
          countRef.current.push(lastId);
          // dispatch 순식간에 여러번 실행되는거 막기
          // saga에서는 쓰로틀링으로 막고있음
        }
      }
    }
  }, [mainPosts.length, hasMorePost]);

  // 게시물 infinity 스크롤 로직

  // 0. 페이지에 처음 접속하면  load main post reqeust가 발생하고
  // 서버에서 전체 posts를 작성날짜로 desc정렬한뒤
  // 10개를 불러온다.

  // 1. 스크롤을 내렸을때 스크롤한높이가 전체높이보다 300적을때

  // 2. hasmorePost를 검사한다.
  // hasmorepost는 init:false 이고
  // 처음 페이지에 접속해서 main_Posts_request가 일어날때 불러온 mainPosts 배열의
  // 마지막 객체의 id를(lastId) 검사한다.

  // 3. lastId가 0이면 그대로 false해서 더이상 request하지 않고
  // lastId가 1이상이면 그 게시물보다 낮은 id를 가진 post가 db에 있다고 생각해서
  // request를 일으킨다.

  // 4. request를 일으키면서 lastid를 같이 disaptch 하고
  // 서버에 get요청으로 lastId를 보낸다.

  // 5.  sequelize.op.lt 를 이용해서 lastId보다 적은 Id값을 조건으로 게시물을 불러온다
  // 불러온 posts들을 기존 posts에 concat한다

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [mainPosts]); // 강력한 캐싱 방지

  return (
    <>
      <Row type="flex" justify="center">
        <Col xs={24} md={15}>
          {mainPosts &&
            mainPosts.map(c => {
              return <PostCard key={c.id} post={c} />;
            })}
        </Col>
        <Col xs={0} md={9}>
          <Affix offsetTop={90}>
            <ProfileWrapper>
              <UserProfile />
              {me ? null : <LoginForm />}
              <CopyRight>
                <Link
                  href="//github.com/ristretto-code/React-sns"
                  prefetch={false}
                >
                  <a target="_blank">2019 IAN CHOI</a>
                </Link>
              </CopyRight>
            </ProfileWrapper>
          </Affix>
        </Col>
      </Row>
    </>
  );
};

Home.getInitialProps = async context => {
  // console.log(Object.keys(context));
  const state = context.store.getState();
  context.store.dispatch({
    type: LOAD_MAIN_POSTS_REQUEST
  });
  context.store.dispatch({
    type: LOAD_USER_POSTS_REQUEST,
    data: state.user.me && state.user.me.id
  });
};

export default Home;
