import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import defaultProfile from "../assets/profile.jpg";

const API_BASE = "/api/users"; // ✅ relative path

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    gender: "Male",
    userStatus: "Active",
    location: "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(defaultProfile);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE}/${id}`);
        setForm({
          firstName: res.data.firstName || "",
          lastName: res.data.lastName || "",
          email: res.data.email || "",
          mobile: res.data.mobile || "",
          gender: res.data.gender || "Male",
          userStatus: res.data.userStatus || "Active",
          location: res.data.location || "",
        });
        setPreview(res.data.profileImage || defaultProfile);
      } catch (err) {
        console.error("Fetch user error:", err.response?.data || err.message);
        alert("Failed to load user data");
      }
    };
    fetchUser();
  }, [id]);

  useEffect(() => {
    return () => {
      if (preview && file) URL.revokeObjectURL(preview);
    };
  }, [preview, file]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    setFile(f || null);
    setPreview(f ? URL.createObjectURL(f) : defaultProfile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageToUpload = null;

      if (file) {
        imageToUpload = file;
      } else if (preview && preview !== defaultProfile) {
        imageToUpload = preview;
      } else {
        const res = await fetch(defaultProfile);
        const blob = await res.blob();
        imageToUpload = new File([blob], "defaultProfile.jpg", {
          type: blob.type,
        });
      }

      const fd = new FormData();
      Object.keys(form).forEach((k) => fd.append(k, form[k]));
      fd.append("profileImage", imageToUpload);

      await axios.put(`${API_BASE}/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/");
    } catch (err) {
      console.error("Update user error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: 900 }}>
        <div className="card-body">
          <h4 className="text-center mb-3">Edit User Details</h4>

          <div className="text-center mb-3">
            <img
              src={preview}
              alt="avatar"
              width="80"
              height="80"
              className="rounded-circle border"
              style={{ objectFit: "cover" }}
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">First Name</label>
                <input
                  name="firstName"
                  className="form-control"
                  placeholder="Enter First Name"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Last Name</label>
                <input
                  name="lastName"
                  className="form-control"
                  placeholder="Enter Last Name"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Mobile</label>
                <input
                  name="mobile"
                  className="form-control"
                  placeholder="Enter Mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label d-block">Gender</label>
                {["Male", "Female", "Other"].map((g) => (
                  <div className="form-check form-check-inline" key={g}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      value={g}
                      checked={form.gender === g}
                      onChange={handleChange}
                      id={`g-${g}`}
                    />
                    <label className="form-check-label" htmlFor={`g-${g}`}>
                      {g}
                    </label>
                  </div>
                ))}
              </div>

              <div className="col-md-6">
                <label className="form-label">Status</label>
                <select
                  name="userStatus"
                  className="form-select"
                  value={form.userStatus}
                  onChange={handleChange}
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  name="profileImage"
                  className="form-control"
                  onChange={handleFile}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Location</label>
                <input
                  name="location"
                  className="form-control"
                  placeholder="Enter Your Location"
                  value={form.location}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12 mt-3">
                <button
                  className="btn btn-danger w-100"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update User"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
