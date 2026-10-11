import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

const TOPICS = [
  { value: "thesis_research", label: "Thesis & Research" },
  { value: "scholarship", label: "Scholarship & Higher Studies" },
  { value: "career", label: "Career Planning" },
  { value: "job", label: "Job Preparation" },
  { value: "internship", label: "Internship Opportunities" },
  { value: "freelancing", label: "Freelancing" },
  { value: "software", label: "Software Development" },
  { value: "ai_ml", label: "Machine Learning & AI" },
  { value: "entrepreneurship", label: "Entrepreneurship" },
  { value: "other", label: "Other" },
];

export default function MentorshipRequestForm() {
  const { mentorId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    mentor: mentorId || "",
    topic: "career",
    title: "",
    message: "",
    specific_questions: "",
    preferred_communication: "email",
    preferred_availability: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFieldErrors((previous) => ({
      ...previous,
      [name]: undefined,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setFieldErrors({});

    if (!formData.mentor) {
      setError("Please select an alumnus first.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "mentorship/requests/",
        {
          ...formData,
          mentor: Number(formData.mentor),
        }
      );

      setSuccess("Your mentorship request has been sent successfully!");

      // Navigate after successful submission.
      navigate("/my-mentorships", {
        state: {
          success: "Your mentorship request has been sent successfully!",
          requestId: response.data.id,
        },
      });
    } catch (err) {
      const data = err.response?.data;

      if (data && typeof data === "object") {
        setFieldErrors(data);

        const messages = Object.entries(data)
          .flatMap(([key, value]) => {
            if (key === "detail") {
              return [String(value)];
            }

            if (Array.isArray(value)) {
              return value.map(String);
            }

            if (typeof value === "string") {
              return [value];
            }

            return [];
          });

        setError(
          messages.join(" ") ||
            "Unable to submit the request. Please check your information."
        );
      } else {
        setError(
          "Unable to connect to the server. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const renderFieldError = (fieldName) => {
    const value = fieldErrors[fieldName];

    if (!value) return null;

    const message = Array.isArray(value)
      ? value.join(" ")
      : typeof value === "string"
        ? value
        : "";

    return message ? (
      <div className="text-danger small mt-1">
        {message}
      </div>
    ) : null;
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <h2 className="mb-2">Request Mentorship</h2>

              <p className="text-muted mb-4">
                Explain your goals and what guidance you need
                from your alumnus mentor.
              </p>

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">
                    Mentorship Topic <span className="text-danger">*</span>
                  </label>

                  <select
                    name="topic"
                    className="form-select"
                    value={formData.topic}
                    onChange={handleChange}
                    required
                  >
                    {TOPICS.map((topic) => (
                      <option
                        key={topic.value}
                        value={topic.value}
                      >
                        {topic.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Request Title <span className="text-danger">*</span>
                  </label>

                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    placeholder="e.g. Guidance on starting ML research"
                    value={formData.title}
                    onChange={handleChange}
                    maxLength={200}
                    required
                  />

                  {renderFieldError("title")}
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Your Message <span className="text-danger">*</span>
                  </label>

                  <textarea
                    name="message"
                    className="form-control"
                    rows="5"
                    placeholder="Introduce yourself and explain what guidance you need..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />

                  {renderFieldError("message")}
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Specific Questions
                  </label>

                  <textarea
                    name="specific_questions"
                    className="form-control"
                    rows="3"
                    placeholder="What specific questions would you like to ask?"
                    value={formData.specific_questions}
                    onChange={handleChange}
                  />

                  <div className="form-text">
                    Optional. List any specific questions you have.
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Preferred Communication Method <span className="text-danger">*</span>
                  </label>

                  <select
                    name="preferred_communication"
                    className="form-select"
                    value={formData.preferred_communication}
                    onChange={handleChange}
                    required
                  >
                    <option value="email">Email</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label">
                    Preferred Availability
                  </label>

                  <input
                    type="text"
                    name="preferred_availability"
                    className="form-control"
                    placeholder="e.g. Friday evening or weekends"
                    value={formData.preferred_availability}
                    onChange={handleChange}
                    maxLength={255}
                  />

                  <div className="form-text">
                    Optional. Let your mentor know when you are
                    generally available.
                  </div>
                </div>

                <div className="d-flex flex-wrap gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={loading}
                  >
                    {loading
                      ? "Sending Request..."
                      : "Send Mentorship Request"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate(-1)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}