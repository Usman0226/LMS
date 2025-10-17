import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const isTeacher = currentUser?.role === 'teacher';

  const accentGradient = 'from-orange-500 via-orange-500 to-orange-500';
  const surfaceHighlight = isTeacher ? 'bg-orange-50' : 'bg-orange-50';
  const accentText = isTeacher ? 'text-orange-600' : 'text-orange-500';
  const timelineDot = isTeacher ? 'bg-orange-400' : 'bg-orange-400';

  const primaryAction = useMemo(
    () =>
      isTeacher
        ? {
            label: 'Create new course',
            destination: '/courses',
            description: 'Plan your next class and publish updates for your students.',
          }
        : {
            label: 'Continue learning',
            destination: '/dashboard',
            description: 'Pick up where you left off and stay on track with upcoming lessons.',
          },
    [isTeacher],
  );

  const stats = useMemo(() => {
    if (!currentUser) {
      return [];
    }
    if (isTeacher) {
      return [
        {
          label: 'Courses taught',
          value: currentUser?.courses?.length ?? 0,
          subtitle: 'Active classroom spaces',
        },
        {
          label: 'Active students',
          value: currentUser?.activeStudents ?? 0,
          subtitle: 'Engaged learners this week',
        },
        {
          label: 'Pending reviews',
          value: currentUser?.pendingReviews ?? 0,
          subtitle: 'Assignments awaiting feedback',
        },
      ];
    }
    return [
      {
        label: 'Enrolled courses',
        value: currentUser?.courses?.length ?? 0,
        subtitle: 'Learning paths you follow',
      },
      {
        label: 'Assignments completed',
        value: currentUser?.completedAssignments ?? 0,
        subtitle: 'Checked off in the last 30 days',
      },
      {
        label: 'Average grade',
        value: currentUser?.averageGrade ?? '—',
        subtitle: 'Overall performance to date',
      },
    ];
  }, [currentUser, isTeacher]);

  const roleData = useMemo(() => {
    if (!currentUser) {
      return {
        overviewTitle: '',
        overviewDescription: '',
        sections: [],
      };
    }

    if (isTeacher) {
      return {
        overviewTitle: 'Teaching overview',
        overviewDescription: 'Monitor the classes you manage and upcoming touchpoints.',
        sections: [
          {
            label: 'Courses you teach',
            empty: 'No courses assigned yet.',
            items: currentUser.courses ?? [],
          },
          {
            label: 'Upcoming sessions',
            empty: 'No sessions scheduled.',
            items: currentUser.upcomingSessions ?? [],
          },
        ],
      };
    }

    return {
      overviewTitle: 'Learning overview',
      overviewDescription: 'Track your study plan, coursework, and upcoming deadlines.',
      sections: [
        {
          label: 'Enrolled courses',
          empty: 'Enroll in a course to get started.',
          items: currentUser.courses ?? [],
        },
        {
          label: 'Upcoming deadlines',
          empty: 'No deadlines right now.',
          items: currentUser.upcomingDeadlines ?? [],
        },
      ],
    };
  }, [currentUser, isTeacher]);

  const activityItems = useMemo(
    () => (currentUser?.activity ?? []).map((item) => (typeof item === 'string' ? { title: item } : item)),
    [currentUser],
  );

  const emptyActivityText = isTeacher
    ? 'Activity will appear here as you interact with your classes.'
    : 'Activity will appear here as you work through assignments.';

  if (!currentUser) {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-6 rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 via-orange-500 to-orange-500 text-2xl font-semibold text-white">
          P
        </div>
        <h1 className="text-3xl font-semibold text-gray-900">Profile</h1>
        <p className="text-base text-gray-600">Sign in to unlock personalized insights and course recommendations.</p>
      </div>
    );
  }

  const userInitial = currentUser?.name?.[0]?.toUpperCase() ?? 'P';

  return (
    <div className="space-y-10">
      <header className={`rounded-3xl bg-gradient-to-r ${accentGradient} p-8 text-white shadow-xl`}>
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-2xl font-semibold uppercase shadow-md">
                {userInitial}
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-white/70">{currentUser.role}</p>
                <h1 className="text-4xl font-bold md:text-5xl">{currentUser.name}</h1>
                <p className="text-white/80">{currentUser.email}</p>
              </div>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-white/80">
              {isTeacher
                ? 'Inspire your learners with timely feedback, structured sessions, and confident planning.'
                : 'Stay focused on your study milestones with personalized insights and momentum tracking.'}
            </p>
          </div>
          <div className="flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-white/15 p-6 shadow-lg backdrop-blur-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-white/80">Next best action</p>
            <p className="text-sm text-white/90">{primaryAction.description}</p>
            <button
              type="button"
              onClick={() => navigate(primaryAction.destination)}
              className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-md transition hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              {primaryAction.label}
            </button>
          </div>
        </div>
      </header>

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <p className={`text-xs font-semibold uppercase tracking-wide ${accentText}`}>{stat.label}</p>
            <p className="mt-3 text-4xl font-semibold text-gray-900">{stat.value}</p>
            <p className="mt-2 text-sm text-gray-500">{stat.subtitle}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Account details</h2>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className={`flex flex-col gap-1 rounded-2xl ${surfaceHighlight} p-5`}>
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Full name</dt>
              <dd className="text-base text-gray-900">{currentUser.name}</dd>
            </div>
            <div className={`flex flex-col gap-1 rounded-2xl ${surfaceHighlight} p-5`}>
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Email address</dt>
              <dd className="text-base text-gray-900">{currentUser.email}</dd>
            </div>
            <div className={`flex flex-col gap-1 rounded-2xl ${surfaceHighlight} p-5`}>
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Role</dt>
              <dd className="text-base capitalize text-gray-900">{currentUser.role}</dd>
            </div>
            {(currentUser.timezone || currentUser.location) && (
              <div className={`flex flex-col gap-1 rounded-2xl ${surfaceHighlight} p-5`}>
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">Preferences</dt>
                <dd className="text-base text-gray-900">
                  {[currentUser.location, currentUser.timezone].filter(Boolean).join(' • ')}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">{roleData.overviewTitle}</h2>
          <p className="mt-2 text-sm text-gray-600">{roleData.overviewDescription}</p>
          <div className="mt-8 space-y-5">
            {roleData.sections.map((section) => (
              <div key={section.label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <p className={`text-xs font-semibold uppercase tracking-wide ${accentText}`}>{section.label}</p>
                <ul className="mt-4 space-y-3">
                  {section.items.length === 0 && <li className="text-sm text-gray-500">{section.empty}</li>}
                  {section.items.map((item, index) => {
                    const title = typeof item === 'string' ? item : item?.title ?? item?.name ?? `Item ${index + 1}`;
                    const meta =
                      typeof item === 'string' ? null : item?.subtitle ?? item?.description ?? item?.due ?? item?.date;
                    return (
                      <li key={`${section.label}-${index}`} className={`rounded-xl ${surfaceHighlight} p-4`}>
                        <p className="text-sm font-semibold text-gray-900">{title}</p>
                        {meta && <p className="text-xs text-gray-500">{meta}</p>}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">Recent activity</h2>
        <div className="relative mt-8">
          <span className="pointer-events-none absolute left-3 top-0 h-full w-px bg-gray-200" />
          <ul className="space-y-6">
            {activityItems.length === 0 && (
              <li className={`rounded-2xl ${surfaceHighlight} p-5 text-sm text-gray-600`}>{emptyActivityText}</li>
            )}
            {activityItems.map((item, index) => (
              <li key={`${item.title ?? 'activity'}-${index}`} className="relative flex items-start gap-4 pl-10">
                <span className={`absolute left-1 top-3 h-3 w-3 rounded-full ${timelineDot}`} />
                <div className="flex-1 rounded-2xl bg-gray-50 p-5 shadow-sm">
                  <p className="text-sm font-semibold text-gray-900">{item.title ?? `Update ${index + 1}`}</p>
                  {item.description && <p className="mt-1 text-sm text-gray-600">{item.description}</p>}
                  {(item.timestamp || item.date) && (
                    <p className="mt-3 text-xs font-medium text-gray-500">{item.timestamp ?? item.date}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
