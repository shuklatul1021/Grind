import { DashboardMockSectionPage } from "../_components/mock-section-page";
import { SECTION_MOCK_DATA } from "../_data/section-mock-data";

export default function AdminTeamPage() {
  return <DashboardMockSectionPage content={SECTION_MOCK_DATA["admin-team"]} />;
}
