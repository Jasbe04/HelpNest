import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const navigate = useNavigate();

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(
        "mentorship/notifications/"
      );

      setNotifications(
        Array.isArray(response.data)
          ? response.data
          : response.data.results || []
      );
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to load notifications."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkRead = async (notificationId) => {
    setProcessingId(notificationId);
    setError("");

    try {
      await api.post(
        `mentorship/notifications/${notificationId}/read/`
      );

      setNotifications((previous) =>
        previous.map((notification) =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to mark notification as read."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      // Mark the notification as read if it isn't already
      if (!notification.is_read) {
        await api.post(
          `mentorship/notifications/${notification.id}/read/`
        );

        setNotifications((previous) =>
          previous.map((item) =>
            item.id === notification.id
              ? { ...item, is_read: true }
              : item
          )
        );
      }

      // Open the related mentorship request
      if (notification.mentorship_request) {
        navigate(
          `/mentorship/requests/${notification.mentorship_request}`
        );
      }
    } catch (error) {
      console.error("Unable to open notification:", error);
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" />
        <p className="mt-3">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2>Notifications</h2>
          <p className="text-muted mb-0">
            Stay updated on your activity in HelpNest.
          </p>
        </div>

        <span className="badge bg-primary fs-6">
          {unreadCount} unread
        </span>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <h5>You are all caught up!</h5>
            <p className="text-muted mb-0">
              You don't have any notifications yet.
            </p>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`card border-0 shadow-sm ${
                notification.is_read
                  ? ""
                  : "border-start border-4 border-primary"
              }`}
            >
              <div className="card-body p-4">
                <div className="d-flex flex-wrap justify-content-between align-items-start gap-2">
                  <div>
                    <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                      <h5 className="mb-0">
                        {notification.title}
                      </h5>

                      {!notification.is_read && (
                        <span className="badge bg-primary">
                          New
                        </span>
                      )}
                    </div>

                    <p className="text-muted small mb-2">
                      {notification.notification_type_display ||
                        notification.notification_type}
                    </p>
                  </div>

                  <small className="text-muted">
                    {new Date(
                      notification.created_at
                    ).toLocaleString()}
                  </small>
                </div>

                <p className="mb-3">
                  {notification.message}
                </p>

                <div className="d-flex flex-wrap gap-2">
                  {notification.mentorship_request && (
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      View Request
                    </button>
                  )}

                  {!notification.is_read && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() =>
                        handleMarkRead(notification.id)
                      }
                      disabled={
                        processingId === notification.id
                      }
                    >
                      {processingId === notification.id
                        ? "Updating..."
                        : "Mark as Read"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <button
          className="btn btn-outline-secondary"
          onClick={fetchNotifications}
        >
          Refresh Notifications
        </button>
      </div>
    </div>
  );
}