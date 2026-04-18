import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CSSProperties } from "react";

export type DashboardSectionMetric = {
  label: string;
  value: string;
  note: string;
};

export type DashboardSectionContent = {
  title: string;
  description: string;
  metrics: DashboardSectionMetric[];
  columns: [string, string, string, string];
  rows: Array<[string, string, string, string]>;
};

type DashboardMockSectionPageProps = {
  content: DashboardSectionContent;
};

export function DashboardMockSectionPage({
  content,
}: DashboardMockSectionPageProps) {
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
          <div className="@container/main flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <h2 className="text-xl font-semibold">{content.title}</h2>
              <p className="text-muted-foreground text-sm">
                {content.description}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                This page is currently powered by mock data.
              </p>
            </div>

            <div className="grid gap-4 px-4 md:grid-cols-3 lg:px-6">
              {content.metrics.map((metric) => (
                <Card key={metric.label}>
                  <CardHeader>
                    <CardDescription>{metric.label}</CardDescription>
                    <CardTitle className="text-2xl">{metric.value}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-xs">
                      {metric.note}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="px-4 lg:px-6">
              <Card>
                <CardHeader>
                  <CardTitle>{content.title} Snapshot</CardTitle>
                  <CardDescription>
                    Mock records for UI and flow testing.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {content.columns.map((column) => (
                          <TableHead key={column}>{column}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {content.rows.map((row, index) => (
                        <TableRow key={`${row[0]}-${index}`}>
                          {row.map((cell) => (
                            <TableCell key={`${row[0]}-${cell}`}>
                              {cell}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
