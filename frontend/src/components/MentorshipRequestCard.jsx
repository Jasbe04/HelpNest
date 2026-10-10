
function MentorshipRequestCard({
  request,
  onAccept,
  onReject,
  onCancel,
  showActions = false,
  showDecisionActions = false,
}) {
  const statusColors = {
    pending: 'warning',
    accepted: 'success',
    rejected: 'danger',
    cancelled: 'secondary',
    completed: 'primary',
  }

  const status = String(request.status || 'pending')
    .trim()
    .toLowerCase()

  const badgeColor = statusColors[status] || 'secondary'

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
          <div>
            <h5 className="card-title mb-1">
              {request.title}
            </h5>

            <span className="badge bg-light text-dark border">
              {request.topic_display || request.topic}
            </span>
          </div>

          <span className={`badge bg-${badgeColor}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>

        <p className="text-secondary small mb-2">
          {request.student_name && (
            <>
              <i className="bi bi-person me-1"></i>
              Student: {request.student_name}
              <br />
            </>
          )}

          {request.mentor_name && (
            <>
              <i className="bi bi-person-badge me-1"></i>
              Mentor: {request.mentor_name}
              <br />
            </>
          )}

          {request.created_at && (
            <>
              <i className="bi bi-calendar3 me-1"></i>
              {new Date(request.created_at).toLocaleDateString()}
            </>
          )}
        </p>

        <p className="card-text">
          {request.message}
        </p>

        {request.specific_questions && (
          <div className="bg-light rounded p-3 mb-3">
            <strong>Specific questions:</strong>
            <p className="mb-0 mt-1">
              {request.specific_questions}
            </p>
          </div>
        )}

        {request.preferred_communication && (
          <p className="small mb-2">
            <strong>Preferred communication:</strong>{' '}
            {request.preferred_communication === 'email'
              ? 'Email'
              : request.preferred_communication === 'linkedin'
                ? 'LinkedIn'
                : request.preferred_communication}
          </p>
        )}

        {request.preferred_availability && (
          <p className="small mb-3">
            <strong>Preferred availability:</strong>{' '}
            {request.preferred_availability}
          </p>
        )}

        {/* Alumni: Accept and Reject */}
        {showDecisionActions && status === 'pending' && (
          <div className="d-flex flex-wrap gap-2 mt-3">
            <button
              type="button"
              className="btn btn-success btn-sm"
              onClick={() => onAccept?.(request.id)}
            >
              <i className="bi bi-check-circle me-1"></i>
              Accept
            </button>

            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={() => onReject?.(request.id)}
            >
              <i className="bi bi-x-circle me-1"></i>
              Reject
            </button>
          </div>
        )}

        {/* Student: Cancel request */}
        {showActions && status === 'pending' && (
          <div className="d-flex flex-wrap gap-2 mt-3">
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={() => onCancel?.(request.id)}
            >
              Cancel Request
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MentorshipRequestCard

