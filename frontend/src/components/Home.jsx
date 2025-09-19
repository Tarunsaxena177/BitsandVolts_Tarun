import React, { useState, useEffect } from "react";
import axios from "axios";
import defaultProfile from "../assets/profile.jpg";
import { useNavigate } from "react-router-dom";

const API_BASE = "/api/users"; // ✅ relative path

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 6;
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}?search=${encodeURIComponent(
          search
        )}&page=${page}&limit=${limit}`
      );

      const mappedUsers = (res.data.users || []).map((u) => ({
        ...u,
        profileImage: u.profileImage || defaultProfile,
      }));
      setUsers(mappedUsers);
      setTotal(res.data.total || 0);
    } catch (error) {
      console.error(
        "Fetch users error:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, page]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Delete error:", error.response?.data || error.message);
    }
  };

  const handleExport = async () => {
    try {
      const res = await axios.get(`${API_BASE}/export/csv`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "users.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Export error:", error.response?.data || error.message);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="card-custom home-card">
      {users.length > 0 && (
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="w-50 d-flex">
            <input
              className="form-control me-2"
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            <button
              className="btn btn-danger"
              onClick={() => {
                setPage(1);
                fetchUsers();
              }}
            >
              Search
            </button>
          </div>
          <div>
            <button
              className="btn btn-outline-secondary me-2 add-user-btn"
              onClick={() => navigate("/add")}
            >
              + Add User
            </button>
            <button className="btn btn-danger" onClick={handleExport}>
              Export To Csv
            </button>
          </div>
        </div>
      )}

      {users.length === 0 ? (
        <div className="text-center py-5">
          <h4>No records found</h4>
          <button
            className="btn btn-danger mt-3"
            onClick={() => navigate("/add")}
          >
            Please enter your user details
          </button>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>FullName</th>
                  <th>Email</th>
                  <th>Gender</th>
                  <th>Status</th>
                  <th>Profile</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => (
                  <tr key={u._id}>
                    <td>{(page - 1) * limit + idx + 1}</td>
                    <td>
                      {u.firstName} {u.lastName}
                    </td>
                    <td>{u.email}</td>
                    <td>{u.gender?.charAt(0)}</td>
                    <td>
                      <div className="dropdown">
                        <button
                          className={`btn btn-sm dropdown-toggle ${
                            u.userStatus === "Active"
                              ? "btn-danger"
                              : "btn-light"
                          }`}
                          type="button"
                          data-bs-toggle="dropdown"
                        >
                          {u.userStatus}
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={async () => {
                                await axios.put(`${API_BASE}/${u._id}`, {
                                  userStatus: "Active",
                                });
                                fetchUsers();
                              }}
                            >
                              Active
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={async () => {
                                await axios.put(`${API_BASE}/${u._id}`, {
                                  userStatus: "Inactive",
                                });
                                fetchUsers();
                              }}
                            >
                              Inactive
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>

                    <td>
                      <img
                        src={u.profileImage}
                        alt="profile"
                        className="profile-sm"
                      />
                    </td>
                    <td>
                      <div className="dropdown">
                        <button
                          className="btn btn-sm btn-light"
                          type="button"
                          data-bs-toggle="dropdown"
                        >
                          ⋮
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => navigate(`/view/${u._id}`)}
                            >
                              👁 View
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => navigate(`/edit/${u._id}`)}
                            >
                              ✏ Edit
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item text-danger"
                              onClick={() => handleDelete(u._id)}
                            >
                              🗑 Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              Showing {(page - 1) * limit + 1} - {Math.min(total, page * limit)}{" "}
              of {total}
            </div>
            <div>
              <button
                className="btn btn-outline-secondary me-2"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                ‹
              </button>
              <span className="btn btn-danger disabled">{page}</span>
              <button
                className="btn btn-outline-secondary ms-2"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                ›
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserList;
