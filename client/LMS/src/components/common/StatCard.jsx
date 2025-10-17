import PropTypes from 'prop-types';

const TONE_STYLES = {
  default: 'bg-brand-light/20 text-brand-dark border border-brand/20',
  success: 'bg-status-success/10 text-status-success border border-status-success/20',
  warning: 'bg-status-warning/10 text-status-warning border border-status-warning/20',
  danger: 'bg-status-danger/10 text-status-danger border border-status-danger/20',
  info: 'bg-status-info/10 text-status-info border border-status-info/20',
};

export default function StatCard({ icon: Icon, label, value, helper, tone = 'default' }) {
  const badgeStyles = TONE_STYLES[tone] ?? TONE_STYLES.default;

  return (
    <article className="rounded-3xl bg-surface shadow-soft border border-border-subtle p-6 transition hover:shadow-card focus-within:shadow-card">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-light/30 text-brand-dark">
          {typeof Icon === 'function' ? <Icon className="h-6 w-6" aria-hidden="true" /> : Icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-secondary" title={label}>
            {label}
          </p>
          <p className="text-2xl font-semibold text-text-primary mt-1 truncate">
            {value}
          </p>
        </div>
      </div>
      {helper && (
        <p className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles}`}>
          {helper}
        </p>
      )}
    </article>
  );
}

StatCard.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  helper: PropTypes.string,
  tone: PropTypes.oneOf(['default', 'success', 'warning', 'danger', 'info']),
};
