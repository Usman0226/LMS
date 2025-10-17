export default function LoadingSpinner(){
  return (
    <div className="w-full flex items-center justify-center py-16">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-primary-600" />
    </div>
  );
}
