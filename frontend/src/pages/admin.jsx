import { useEffect } from "react";
import API from "../api/axios";

const Admin = () => {
  useEffect(() => {
    API.get("/test/admin")
      .then((res) => console.log(res.data))
      .catch((err) => console.log("Access denied"));
  }, []);

  return <h1>Admin Page</h1>;
};

export default Admin;
