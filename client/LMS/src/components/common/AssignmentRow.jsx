import PropTypes from 'prop-types';

const STATUS_STYLES = {
  submitted: 'bg-status-success/10 text-status-success border border-status-success/20',
  pending: 'bg-status-warning/10 text-status-warning border border-status-warning/20',
  overdue: 'bg-status-danger/10 text-status-danger border border-status-danger/20',
};

export default function AssignmentRow({
  title,
  courseName,
  dueDate,
  points,
  status,
  actions,
}) {
  const badgeTone = STATUS_STYLES[status] ?? STATUS_STYLES.pending;

  return (
    <li className="flex flex-col gap-3 rounded-2xl border border-border-subtle bg-surface p-4 shadow-soft transition hover:shadow-card focus-within:shadow-card sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-base font-semibold text-text-primary">{title}</p>
        <p className="text-sm text-text-secondary mt-1">{courseName}</p>
        <p className="flex items-center gap-2 text-xs text-text-muted mt-2">
          <span>Due {dueDate}</span>
          <span aria-hidden="true">•</span>
          <span>{points} pts</span>
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeTone}`}>
          {status === 'submitted' ? 'Submitted' : status === 'overdue' ? 'Overdue' : 'Pending'}
        </span>
        {actions}
      </div>
    </li>
  );
}

AssignmentRow.propTypes = {
  title: PropTypes.string.isRequired,
  courseName: PropTypes.string.isRequired,
  dueDate: PropTypes.string.isRequired,
  points: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  status: PropTypes.oneOf(['submitted', 'pending', 'overdue']).isRequired,
  actions: PropTypes.node,
};
