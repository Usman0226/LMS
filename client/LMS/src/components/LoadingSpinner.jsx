export default function LoadingSpinner() {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center bg-background text-brand">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-border-subtle border-t-brand" />
    </div>
  );
}
