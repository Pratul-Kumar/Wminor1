import React from "react";
import "./style.scss";
import { UserInfoState } from "../../context/UserInfoContext";

const UserDp = ({ dpImg }) => {
  const { userInfo } = UserInfoState();
  return (
    <>
      <div className="userDp">
        {/* <img src={`http://localhost:3000/api/user/show-dp/${dpImg}`} alt="UserDP" /> */}
      </div>
    </>
  );
};

export default UserDp;
