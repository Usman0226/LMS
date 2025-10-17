export default function UserAvatar({ name = 'User' }){
  const initials = name.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase();
  return (
    <div className="h-10 w-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold">
      {initials}
    </div>
  );
}
