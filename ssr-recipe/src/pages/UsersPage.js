import React from "react";
import UsersContainer from "../containers/UsersContainer";
import UserContainer from "../containers/UserContainer";
import { Routes, Route, useParams } from "react-router-dom";

const UsersPage = () => {
  const params = useParams();
  return (
    <>
      <UsersContainer />
      <Routes>
        <Route path="/users/:id" element={<UserContainer id={params.id} />} />
      </Routes>
    </>
  );
};

export default UsersPage;
