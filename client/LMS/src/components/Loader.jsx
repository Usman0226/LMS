export default function Loader({ size = 'md', fullScreen = false }) {
  const sizeClasses = {
    xs: 'h-4 w-4 border-2',
    sm: 'h-6 w-6 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-4',
    xl: 'h-16 w-16 border-4',
  };

  const loader = (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} animate-spin rounded-full border-t-2 border-b-2 border-primary-500`}
      ></div>
      <span className="sr-only">Loading...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        {loader}
      </div>
    );
  }

  return loader;
}

// Prop types for better development experience
Loader.propTypes = {
  size: (props, propName, componentName) => {
    const validSizes = ['xs', 'sm', 'md', 'lg', 'xl'];
    if (props[propName] && !validSizes.includes(props[propName])) {
      return new Error(
        `Invalid prop '${propName}' supplied to '${componentName}'. Expected one of [${validSizes.join(', ')}].`
      );
    }
  },
  fullScreen: (props, propName, componentName) => {
    if (typeof props[propName] !== 'boolean') {
      return new Error(
        `Invalid prop '${propName}' supplied to '${componentName}'. Expected a boolean.`
      );
    }
  },
};
