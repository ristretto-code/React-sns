import React, { useState, useCallback, useEffect } from "react";
import { Avatar, Card, Icon, Input, Button, Form, List, Comment } from "antd";
import proptypes from "prop-types";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { ADD_COMMENT_REQUEST } from "../reducers/post";

const PostCard = ({ post }) => {
  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const [commentText, setCommentText] = useState("");
  const { me } = useSelector(state => state.user);
  const { commentAdded, isAddingComment } = useSelector(state => state.post);
  const dispatch = useDispatch();

  console.log("--post--");
  console.log(post);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened(prev => !prev);
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
          postId: post.id
        }
      });
    },
    [me && me.id]
  );

  useEffect(() => {
    setCommentText("");
  }, [commentAdded === true]);

  const onChangeCommentText = useCallback(e => {
    setCommentText(e.target.value);
  }, []);

  return (
    <div>
      <Card
        // key={+post.createdAt}
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
          <Icon type="message" key="message" onClick={onToggleComment} />,
          <Icon type="ellipsis" key="ellipsis" />
        ]}
        // extra={}
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
                row={4}
                value={commentText}
                onChange={onChangeCommentText}
              />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={isAddingComment}>
              삐약
            </Button>
          </Form>
          <List
            header={`${post.Comments ? post.Comments.length : 0}댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments || []}
            renderItem={item => (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={
                    <Link
                      href={{ pathname: "/user/", query: { id: item.User.id } }}
                      as={`/user/${item.User.id}`}
                    >
                      <a>
                        <Avatar>{item.User.nickname[0]}</Avatar>
                      </a>
                    </Link>
                  }
                  content={item.content}
                  datetime={item.createdAt}
                />
              </li>
            )}
          />
        </>
      )}
    </div>
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