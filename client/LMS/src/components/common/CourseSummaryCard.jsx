import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function CourseSummaryCard({
  id,
  title,
  code,
  description,
  instructor,
  credits,
  progress,
  status,
  action,
  footer,
}) {
  return (
    <article className="rounded-3xl border border-border-subtle bg-surface shadow-soft transition hover:shadow-card">
      <div className="bg-gradient-to-r from-brand to-brand-dark px-6 py-8 text-text-inverse">
        <p className="text-xs font-semibold uppercase tracking-wide opacity-80">{code}</p>
        <h3 className="mt-2 text-2xl font-semibold leading-snug">{title}</h3>
        <p className="mt-4 text-sm text-text-inverse/80 line-clamp-2">{description}</p>
      </div>

      <div className="space-y-4 px-6 py-5">
        <dl className="grid grid-cols-2 gap-4 text-sm text-text-secondary">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">Instructor</dt>
            <dd className="mt-1 text-text-primary">{instructor}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">Credits</dt>
            <dd className="mt-1 text-text-primary">{credits}</dd>
          </div>
        </dl>

        {typeof progress === 'number' && (
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-text-muted mb-2">
              <span>Progress</span>
              <span className="text-text-primary">{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-border-subtle">
              <div
                className="h-full rounded-full bg-brand"
                style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          {status && (
            <span className="inline-flex items-center rounded-full bg-status-success/10 px-3 py-1 text-xs font-medium text-status-success">
              {status}
            </span>
          )}
          <Link
            to={`/courses/${id}`}
            className="text-sm font-semibold text-brand hover:text-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
          >
            View Details
          </Link>
        </div>

        {action}
      </div>

      {footer && <div className="border-t border-border-subtle px-6 py-4 text-sm text-text-secondary">{footer}</div>}
    </article>
  );
}

CourseSummaryCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  description: PropTypes.string,
  instructor: PropTypes.string,
  credits: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  progress: PropTypes.number,
  status: PropTypes.string,
  action: PropTypes.node,
  footer: PropTypes.node,
};
