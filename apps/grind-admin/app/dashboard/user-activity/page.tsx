import { DashboardMockSectionPage } from "../_components/mock-section-page";
import { SECTION_MOCK_DATA } from "../_data/section-mock-data";

export default function UserActivityPage() {
  return (
    <DashboardMockSectionPage content={SECTION_MOCK_DATA["user-activity"]} />
  );
}
