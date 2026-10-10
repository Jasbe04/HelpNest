import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../api/axios";

const getStatusClass = (status) => {
  const classes = {
    pending: "bg-warning text-dark",
    accepted: "bg-success",
    rejected: "bg-danger",
    cancelled: "bg-secondary",
    completed: "bg-primary",
  };

  return classes[status] || "bg-secondary";
};

export default function MyMentorshipRequests() {
  const location = useLocation();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(
    location.state?.success || ""
  );
  const [cancellingId, setCancellingId] = useState(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(
        "mentorship/requests/sent/"
      );

      setRequests(
        Array.isArray(response.data)
          ? response.data
          : response.data.results || []
      );
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to load your mentorship requests."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleCancel = async (requestId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this mentorship request?"
    );

    if (!confirmed) return;

    setCancellingId(requestId);
    setError("");
    setMessage("");

    try {
      const response = await api.post(
        `mentorship/requests/${requestId}/cancel/`
      );

      setMessage(
        response.data.message ||
          "Mentorship request cancelled successfully."
      );

      await fetchRequests();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to cancel this request."
      );
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" />
        <p className="mt-3">Loading your requests...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2>My Mentorship Requests</h2>
          <p className="text-muted mb-0">
            Track your requests and their current status.
          </p>
        </div>

        <Link
          to="/"
          className="btn btn-outline-primary"
        >
          Find Alumni
        </Link>
      </div>

      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {requests.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <h5>No mentorship requests yet</h5>

            <p className="text-muted">
              Find an alumnus and send your first mentorship request.
            </p>

            <Link to="/" className="btn btn-primary">
              Explore Alumni
            </Link>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {requests.map((request) => (
            <div
              className="col-md-6 col-lg-4"
              key={request.id}
            >
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                    <span
                      className={`badge ${getStatusClass(
                        request.status
                      )}`}
                    >
                      {request.status_display ||
                        request.status}
                    </span>

                    <small className="text-muted">
                      #{request.id}
                    </small>
                  </div>

                  <h5 className="card-title">
                    {request.title}
                  </h5>

                  <p className="text-muted small mb-2">
                    Mentor: {request.mentor_name}
                  </p>

                  <p className="small mb-2">
                    <strong>Topic:</strong>{" "}
                    {request.topic_display || request.topic}
                  </p>

                  <p className="small mb-3">
                    <strong>Communication:</strong>{" "}
                    {request.preferred_communication_display ||
                      request.preferred_communication}
                  </p>

                  <p className="text-muted small">
                    Submitted:{" "}
                    {new Date(
                      request.created_at
                    ).toLocaleString()}
                  </p>

                  <div className="d-flex flex-wrap gap-2 mt-3">
                    <Link
                      to={`/mentorship/requests/${request.id}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      View Details
                    </Link>

                    {request.status === "pending" && (
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() =>
                          handleCancel(request.id)
                        }
                        disabled={
                          cancellingId === request.id
                        }
                      >
                        {cancellingId === request.id
                          ? "Cancelling..."
                          : "Cancel Request"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}