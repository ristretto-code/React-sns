import React, { useState, useCallback, useEffect } from "react";
import {
  Avatar,
  Card,
  Icon,
  Input,
  Button,
  Form,
  List,
  Comment,
  Popover
} from "antd";
import proptypes from "prop-types";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import {
  ADD_COMMENT_REQUEST,
  LOAD_COMMENTS_REQUEST,
  LIKE_POST_REQUEST,
  UNLIKE_POST_REQUEST,
  REMOVE_POST_REQUEST
} from "../reducers/post";
import { FOLLOW_USER_REQUEST, UNFOLLOW_USER_REQUEST } from "../reducers/user";
import PostImages from "./PostImages";
import styled from "styled-components";

const CardWrapper = styled.div`
  margin-bottom: 30px;
`;

const PostCard = ({ post }) => {
  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const [commentText, setCommentText] = useState("");
  const { me } = useSelector(state => state.user);
  const { commentAdded, isAddingComment } = useSelector(state => state.post);
  const dispatch = useDispatch();

  const liked = me && post.Likers && post.Likers.find(v => v.id === me.id);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened(prev => !prev);
    if (!commentFormOpened) {
      dispatch({
        type: LOAD_COMMENTS_REQUEST,
        data: post.id
      });
    }
  }, []);

  const onSubmitComment = useCallback(
    e => {
      e.preventDefault();
      if (!me) {
        return alert("로그인이 필요합니다");
      }
      dispatch({
        type: ADD_COMMENT_REQUEST,
        data: {
          postId: post.id,
          comment: commentText
        }
      });
    },
    [me && me.id, commentText]
  );

  useEffect(() => {
    setCommentText("");
  }, [commentAdded === true]);

  const onChangeCommentText = useCallback(e => {
    setCommentText(e.target.value);
  }, []);

  const onToggleLike = useCallback(() => {
    if (!me) {
      return alert("로그인이 필요함");
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
    <CardWrapper>
      <Card
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <Icon type="retweet" key="retweet" />,
          <Icon
            type="heart"
            key="heart"
            theme={liked ? "twoTone" : "outlined"}
            twoToneColor="#eb2f96"
            onClick={onToggleLike}
          />,
          <Icon type="message" key="message" onClick={onToggleComment} />,
          <Popover
            key="ellipsis"
            content={
              <Button.Group>
                {me && post.UserId === me.id ? (
                  <>
                    <Button>수정</Button>
                    <Button type="danger" onClick={onRemovePost(post.id)}>
                      삭제
                    </Button>
                  </>
                ) : (
                  <Button>신고</Button>
                )}
              </Button.Group>
            }
          >
            <Icon type="ellipsis" key="ellipsis" />
          </Popover>
        ]}
        extra={
          !me || post.User.id === me.id ? null : me.Followings &&
            me.Followings.find(v => v.id === post.User.id) ? (
            <Button onClick={onUnfollow(post.User.id)}>언팔로우</Button>
          ) : (
            <Button onClick={onFollow(post.User.id)}>팔로우</Button>
          )
        }
      >
        <Card.Meta
          avatar={
            <Link
              href={{ pathname: "/user", query: { id: post.User.id } }}
              as={`/user/${post.User.id}`}
            >
              <a>
                <Avatar>{post.User.nickname[0]}</Avatar>
              </a>
            </Link>
          }
          title={post.User.nickname}
          description={
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
          }
        />
      </Card>
      {commentFormOpened && (
        <>
          <Form onSubmit={onSubmitComment}>
            <Form.Item>
              <Input.TextArea
                rows={4}
                value={commentText}
                onChange={onChangeCommentText}
              />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={isAddingComment}>
              삐약
            </Button>
          </Form>
          <List
            header={`${post.Comments ? post.Comments.length : 0} 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments || []}
            renderItem={item => (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={
                    <Link
                      href={{ pathname: "/user", query: { id: item.User.id } }}
                      as={`/user/${item.User.id}`}
                    >
                      <a>
                        <Avatar>{item.User.nickname[0]}</Avatar>
                      </a>
                    </Link>
                  }
                  content={item.content}
                />
              </li>
            )}
          />
        </>
      )}
    </CardWrapper>
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
