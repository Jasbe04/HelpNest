import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function ReceivedMentorshipRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(
        "mentorship/requests/received/"
      );

      setRequests(
        Array.isArray(response.data)
          ? response.data
          : response.data.results || []
      );
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to load received mentorship requests."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleDecision = async (requestId, decision) => {
    const action =
      decision === "accepted" ? "accept" : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this request?`
    );

    if (!confirmed) return;

    setProcessingId(requestId);
    setError("");
    setMessage("");

    try {
      const response = await api.post(
        `mentorship/requests/${requestId}/decision/`,
        { decision }
      );

      setMessage(
        response.data.message ||
          `Request ${decision} successfully.`
      );

      await fetchRequests();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to update this mentorship request."
      );
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" />
        <p className="mt-3">
          Loading received requests...
        </p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h2>Received Mentorship Requests</h2>

        <p className="text-muted">
          Review requests from students and decide how you
          would like to help.
        </p>
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
            <h5>No requests received yet</h5>

            <p className="text-muted mb-0">
              New mentorship requests will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {requests.map((request) => (
            <div
              className="col-lg-6"
              key={request.id}
            >
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                    <h5>{request.title}</h5>

                    <span
                      className={`badge ${
                        request.status === "pending"
                          ? "bg-warning text-dark"
                          : request.status === "accepted"
                            ? "bg-success"
                            : request.status === "rejected"
                              ? "bg-danger"
                              : "bg-secondary"
                      }`}
                    >
                      {request.status_display ||
                        request.status}
                    </span>
                  </div>

                  <p className="mb-2">
                    <strong>Student:</strong>{" "}
                    {request.student_name}
                  </p>

                  <p className="mb-2">
                    <strong>Topic:</strong>{" "}
                    {request.topic_display || request.topic}
                  </p>

                  <p className="mb-2">
                    <strong>Message:</strong>
                  </p>

                  <p className="text-muted">
                    {request.message}
                  </p>

                  {request.specific_questions && (
                    <>
                      <p className="mb-2">
                        <strong>Specific Questions:</strong>
                      </p>

                      <p className="text-muted">
                        {request.specific_questions}
                      </p>
                    </>
                  )}

                  <hr />

                  <p className="small">
                    <strong>Preferred Contact:</strong>{" "}
                    {request.preferred_communication_display ||
                      request.preferred_communication}
                  </p>

                  {request.preferred_availability && (
                    <p className="small">
                      <strong>Availability:</strong>{" "}
                      {request.preferred_availability}
                    </p>
                  )}

                  <p className="text-muted small">
                    Received:{" "}
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
                      <>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() =>
                            handleDecision(
                              request.id,
                              "accepted"
                            )
                          }
                          disabled={
                            processingId === request.id
                          }
                        >
                          {processingId === request.id
                            ? "Processing..."
                            : "Accept"}
                        </button>

                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() =>
                            handleDecision(
                              request.id,
                              "rejected"
                            )
                          }
                          disabled={
                            processingId === request.id
                          }
                        >
                          Reject
                        </button>
                      </>
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