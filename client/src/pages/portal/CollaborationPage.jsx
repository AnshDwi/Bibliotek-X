import { useOutletContext } from "react-router-dom";

import { CollaborationCard } from "../../components/common/CollaborationCard.jsx";
import { AnnouncementsCard } from "../../components/portal/AnnouncementsCard.jsx";
import { TimetableCard } from "../../components/portal/TimetableCard.jsx";

export const CollaborationPage = () => {
  const { announcements, timetable, user } = useOutletContext();

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <CollaborationCard user={user} />
      <AnnouncementsCard announcements={announcements} />
      <TimetableCard timetable={timetable} />
    </div>
  );
};
