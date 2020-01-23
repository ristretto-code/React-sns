import React from "react";
import Link from "next/link";
import styled from "styled-components";
import moment from "moment";

const UserPostWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid green;
  max-width: 287px;
  max-height: 287px;
  height: 31vw;
  width: 31vw;
  margin-bottom: 7%;
  border: 1px solid #e6e6e6;
  background-color: #ffffff;
`;

const UserPostTime = styled.div`
  font-size: 0.9vw;
  height: 15%;
  text-align: right;
  padding: 2%;
  border-bottom: 1px solid #e6e6e6;
`;
const UserPostImage = styled.div`
  width: 100%;
  height: 85%;
`;

const UserPostContent = styled.div`
  font-size: 0.9vw;
  padding: 5%;
  height: 100%;
  overflow: hidden;
`;

const UserPost = ({ Post }) => {
  return (
    <Link
      href={{ pathname: "/post", query: { id: Post.id } }}
      as={`/post/${Post.id}`}
    >
      <a>
        <UserPostWrapper>
          <UserPostTime>
            {moment(Post.createdAt, "YYYYMMDD, h:mm:ss").fromNow()}
          </UserPostTime>
          {Post.Images && Post.Images.length ? (
            <UserPostImage
              key={Post.id}
              style={{
                background: `no-repeat url("${Post.Images[0].src}")`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            ></UserPostImage>
          ) : (
            <UserPostContent>{Post.content}</UserPostContent>
          )}
        </UserPostWrapper>
      </a>
    </Link>
  );
};

export default UserPost;
