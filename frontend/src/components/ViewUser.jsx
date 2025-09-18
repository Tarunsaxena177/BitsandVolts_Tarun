import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import defaultProfile from "../assets/profile.jpg";

const API_BASE = "http://localhost:8000/api/users";

const ViewUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API_BASE}/${id}`);
        setUser(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };
    fetch();
  }, [id]);

  if (!user) return <div className="card-custom text-center">Loading...</div>;

  return (
    <div className="card-custom">
      <div className="d-flex justify-content-between align-items-center ">
        <h4 className="user-detail-head">User Details</h4>
        <div>
          <button
            className="btn btn-outline-secondary me-2"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          <button
            className="btn btn-danger"
            onClick={() => navigate(`/edit/${id}`)}
          >
            Edit
          </button>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-3 text-center user-image">
          <img
            src={user.profileImage ? user.profileImage : defaultProfile}
            alt="profile"
            className="user-img"
          />
        </div>

        <div className="col-md-9">
          <table className="table">
            <tbody>
              <tr>
                <th>First Name</th>
                <td>{user.firstName}</td>
              </tr>
              <tr>
                <th>Last Name</th>
                <td>{user.lastName}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>{user.email}</td>
              </tr>
              <tr>
                <th>Mobile</th>
                <td>{user.mobile}</td>
              </tr>
              <tr>
                <th>Gender</th>
                <td>{user.gender}</td>
              </tr>
              <tr>
                <th>Status</th>
                <td>{user.userStatus}</td>
              </tr>
              <tr>
                <th>Location</th>
                <td>{user.location}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewUser;
