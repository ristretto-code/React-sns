import React, { useCallback } from "react";
import {
  Avatar,
  Icon,
  Button,
  List,
  Comment,
  Popover,
  Modal,
  Tooltip
} from "antd";
import proptypes from "prop-types";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import {
  LIKE_POST_REQUEST,
  UNLIKE_POST_REQUEST,
  REMOVE_POST_REQUEST
} from "../reducers/post";
import { FOLLOW_USER_REQUEST, UNFOLLOW_USER_REQUEST } from "../reducers/user";
import PostImages from "./PostImages";
import CommentForm from "../containers/CommentForm";
import moment from "moment";
import styled from "styled-components";

const PostWrapper = styled.div`
  display: block;
  margin-bottom: 30px;
  border: 1px solid #e6e6e6;
  border-radius: 3px;
  background-color: #ffffff;
`;

const PostHeader = styled.div`
  border-bottom: 1px solid #e6e6e6;
`;
const UserNameWrapper = styled.div`
  display: inline-block;
  margin: 15px;

  & span {
    margin-right: 13px;
  }
  & a {
    color: #262626;
    font-weight: 600;
  }
`;

const PostDate = styled.span`
  color: #868e96;
`;

const PopoverWrapper = styled.div`
  display: inline-block;
  margin: 15px;
  float: right;
  font-size: 22px;
`;

const PostImage = styled.div``;

const PostContent = styled.div`
  display: flex;
  align-items: center;
  min-height: 80px;
  padding: 15px;
  & a {
    color: #1971c2;
  }
`;
const PostAction = styled.div`
  padding: 0 15px;
  font-size: 20px;
  & * {
    margin-right: 5px;
  }
`;

const PostCommentList = styled.div`
  padding: 0 15px;
`;

const PostComment = styled.div`
  border-top: 1px solid #e6e6e6;
`;

const error = errormsg => {
  Modal.error({
    title: "에러 메세지",
    content: errormsg
  });
};

const PostCard = ({ post }) => {
  const { me } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const liked = me && post.Likers && post.Likers.find(v => v.id === me.id);

  const onToggleLike = useCallback(() => {
    if (!me) {
      return error("로그인이 필요합니다");
    }
    if (liked) {
      dispatch({
        type: UNLIKE_POST_REQUEST,
        data: post.id
      });
    } else {
      //좋아요 안누른 상태
      dispatch({
        type: LIKE_POST_REQUEST,
        data: post.id
      });
    }
  }, [me && me.id, post && post.id, liked]);

  const onFollow = useCallback(
    userId => () => {
      dispatch({
        type: FOLLOW_USER_REQUEST,
        data: userId
      });
    },
    []
  );
  const onUnfollow = useCallback(
    userId => () => {
      dispatch({
        type: UNFOLLOW_USER_REQUEST,
        data: userId
      });
    },
    []
  );

  const onRemovePost = useCallback(userId => () => {
    dispatch({
      type: REMOVE_POST_REQUEST,
      data: userId
    });
  });
  return (
    <PostWrapper>
      <PostHeader>
        <UserNameWrapper>
          <Link
            href={{ pathname: "/user", query: { id: post.User.id } }}
            as={`/user/${post.User.id}`}
          >
            <a>
              <Avatar
                icon="user"
                style={{ backgroundColor: post.User && post.User.profileColor }}
              ></Avatar>
              <span>{post.User && post.User.nickname}</span>
            </a>
          </Link>
          <PostDate>{moment(post.createdAt, "YYYYMMDD").fromNow()}</PostDate>
        </UserNameWrapper>
        <PopoverWrapper>
          <Popover
            key="ellipsis"
            content={
              <Button.Group>
                {me && post.UserId === me.id ? (
                  <Button type="danger" onClick={onRemovePost(post.id)}>
                    삭제
                  </Button>
                ) : null}
                <Button>신고</Button>
              </Button.Group>
            }
          >
            <Icon type="ellipsis" key="ellipsis" />
          </Popover>
        </PopoverWrapper>
      </PostHeader>
      <PostImage>
        {post.Images[0] && <PostImages images={post.Images} />}
      </PostImage>
      <PostContent>
        <div>
          {post.content.split(/(#[^\s]+)/g).map(v => {
            if (v.match(/(#[^\s]+)/)) {
              return (
                <Link
                  href={{
                    pathname: "/hashtag",
                    query: { tag: v.match(/[^#]+/) }
                  }}
                  as={`/hashtag/${v.match(/[^#]+/)}`}
                  key={v}
                >
                  <a>{v}</a>
                </Link>
              );
            }
            return v;
          })}
        </div>
      </PostContent>
      <PostAction>
        <Icon
          type="heart"
          key="heart"
          style={{ color: "#ed4956" }}
          theme={liked ? "filled" : "outlined"}
          onClick={onToggleLike}
        />
        {!me || post.User.id === me.id ? null : me.Followings &&
          me.Followings.find(v => v.id === post.User.id) ? (
          <Tooltip title="UnFollow">
            <Icon
              type="user-delete"
              key="unfollow"
              onClick={onUnfollow(post.User.id)}
            />
          </Tooltip>
        ) : (
          <Tooltip title="Follow">
            <Icon
              type="user-add"
              key="follow"
              style={{ color: "#1864ab" }}
              onClick={onFollow(post.User.id)}
            />
          </Tooltip>
        )}
      </PostAction>
      <PostCommentList>
        {post.Comments.length >= 1 && (
          <List
            header={
              post.Comments && post.Comments.length >= 1
                ? `${post.Comments.length} ${
                    post.Comments.length > 1 ? "replies" : "reply"
                  }`
                : null
            }
            itemLayout="horizontal"
            dataSource={post.Comments}
            renderItem={item => (
              <Comment
                author={item.User.nickname}
                datetime={moment(item.createdAt, "YYYYMMDD").fromNow()}
                avatar={
                  <Link
                    href={{ pathname: "/user", query: { id: item.User.id } }}
                    as={`/user/${item.User.id}`}
                  >
                    <a>
                      <Avatar
                        icon="user"
                        style={{ backgroundColor: item.User.profileColor }}
                      ></Avatar>
                    </a>
                  </Link>
                }
                content={item.content}
              />
            )}
          />
        )}
      </PostCommentList>
      <PostComment>
        <CommentForm post={post} />
      </PostComment>
    </PostWrapper>
  );
};

PostCard.proptypes = {
  post: proptypes.shape({
    User: proptypes.object,
    content: proptypes.string,
    img: proptypes.string,
    createdAt: proptypes.string
  })
};

export default PostCard;
