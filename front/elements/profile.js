import styled from "styled-components";

export const UserInfoContainer = styled.div`
  margin-bottom: 5%;
`;

export const AvatarWrapper = styled.div`
  text-align: center;
`;

export const NicknameWrapper = styled.div`
  margin-top: 15px;
  margin-bottom: 22px;
  font-size: 23px;
  color: #262626;
  & i {
    margin-left: 10px;
    cursor: pointer;
    color: #1864ab;
  }
  & .ant-input {
    width: max-content;
  }
`;

export const UserDataWrapper = styled.div`
  margin-bottom: 22px;

  display: flex;
  font-size: 17px;
  color: #262626;
  & div {
    margin-right: 37px;
  }
  & span {
    font-weight: 600;
  }
`;

export const IntroduceWrapper = styled.div`
  font-size: 15px;
`;

export const UserPostContainer = styled.div`
  display: flex;
  justify-content: space-around;
  height: max-content;
  flex-wrap: wrap;
  border-top: 1px solid #e6e6e6;
  padding-top: 5%;
  & a {
    color: #262626;
  }
`;

export const UserInfoWrapper_M = styled.div`
  display: flex;
  justify-content: center;
  & div {
    margin-right: 20px;
  }
`;
export const UserNameWrapper_M = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5%;
  font-size: 25px;

  & i {
    padding-top: 3px;
    margin-left: 10px;
    font-size: 20px;
    width: 10px;
    cursor: pointer;
  }
`;
export const UserDataWrapper_M = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-top: 3%;
  margin-top: 3%;
  border-top: 1px solid #e6e6e6;

  & div {
    font-weight: 600;
    font-size: 14px;
    text-align: center;
  }
`;
