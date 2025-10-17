import PropTypes from 'prop-types';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}) {
  return (
    <section className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border-subtle bg-surface px-6 py-12 text-center shadow-soft">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-light/20 text-brand">
        {typeof Icon === 'function' ? <Icon className="h-8 w-8" aria-hidden="true" /> : Icon}
      </div>
      <h3 className="mt-6 text-lg font-semibold text-text-primary">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-sm text-text-secondary">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </section>
  );
}

EmptyState.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  action: PropTypes.node,
};
