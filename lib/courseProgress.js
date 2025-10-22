

export function calculateTotalLessons(modules) {
  if (!modules) return 0;
  return modules.reduce(
    (acc, module) => acc + (module.lessons?.length || 0),
    0
  );
}

export function calculateCourseProgress(
  modules,
  completedLessons
) {
  const totalLessons = calculateTotalLessons(modules);
  const totalCompleted = completedLessons.length;

  return Math.round(
    totalLessons > 0 ? (totalCompleted / totalLessons) * 100 : 0
  );
}
