import { AppSidebar } from "@/components/app-sidebar";
import { DataTable } from "@/components/data-table";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { CSSProperties } from "react";

import data from "../data.json";

export default function CreateProblemPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "18rem",
          "--header-height": "3rem",
        } as CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h2 className="text-xl font-semibold">Create Problem</h2>
                <p className="text-muted-foreground text-sm">
                  Build a new coding challenge with starter code, backend
                  executable code, and test cases.
                </p>
              </div>
              <DataTable data={data} defaultView="create-problem" />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
