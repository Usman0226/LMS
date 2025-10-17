import PropTypes from 'prop-types';

function SkeletonBlock({ className }) {
  return <div className={`animate-pulse rounded-xl bg-border-subtle/80 ${className}`} />;
}

SkeletonBlock.propTypes = {
  className: PropTypes.string,
};

export default function SkeletonLoader({ variant = 'card', lines = 3 }) {
  if (variant === 'list') {
    return (
      <ul className="space-y-4">
        {Array.from({ length: lines }).map((_, index) => (
          <li key={index} className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-soft">
            <SkeletonBlock className="h-4 w-1/3" />
            <SkeletonBlock className="mt-3 h-3 w-2/3" />
            <SkeletonBlock className="mt-2 h-3 w-1/2" />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="rounded-3xl border border-border-subtle bg-surface p-6 shadow-soft">
      <SkeletonBlock className="h-6 w-1/4" />
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonBlock key={index} className="mt-4 h-4 w-full" />
      ))}
    </div>
  );
}

SkeletonLoader.propTypes = {
  variant: PropTypes.oneOf(['card', 'list']),
  lines: PropTypes.number,
};
