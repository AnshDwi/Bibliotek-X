import { useOutletContext } from "react-router-dom";

import { FocusModeCard } from "../../components/common/FocusModeCard.jsx";
import { ActivityFeed } from "../../components/timeline/ActivityFeed.jsx";

export const FocusPage = () => {
  const { analytics, notifications, user } = useOutletContext();

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <FocusModeCard analytics={analytics} />
      <ActivityFeed user={user} notifications={notifications} />
    </div>
  );
};
