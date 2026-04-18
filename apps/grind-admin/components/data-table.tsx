"use client";

import * as React from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconLoader,
  IconPlus,
  IconTrash,
  IconTrendingUp,
} from "@tabler/icons-react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { toast } from "sonner";
import { z } from "zod";

import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export const schema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
});

type ProblemDifficulty = "EASY" | "MEDIUM" | "HARD";
type ProblemLanguage =
  | "javascript"
  | "typescript"
  | "python"
  | "java"
  | "cpp"
  | "c"
  | "go"
  | "rust";
type DataTableView =
  | "user-activity"
  | "create-problem"
  | "problem-review"
  | "moderation";

interface DraftTestCase {
  input: string;
  output: string;
}

interface DraftLanguageTemplate {
  id: string;
  language: ProblemLanguage;
  starterCode: string;
  executableCode: string;
}

const LANGUAGE_OPTIONS: Array<{ value: ProblemLanguage; label: string }> = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
];

const DEFAULT_STARTER_CODE_BY_LANGUAGE: Record<ProblemLanguage, string> = {
  javascript:
    "function solve(input) {\n  // write your logic here\n  return input;\n}",
  typescript:
    "function solve(input: string): string {\n  // write your logic here\n  return input;\n}",
  python:
    "def solve(input_data: str) -> str:\n    # write your logic here\n    return input_data",
  java: "class Solution {\n    public static String solve(String input) {\n        // write your logic here\n        return input;\n    }\n}",
  cpp: "#include <bits/stdc++.h>\nusing namespace std;\n\nstring solve(const string& input) {\n  // write your logic here\n  return input;\n}",
  c: "#include <stdio.h>\n#include <string.h>\n\nvoid solve(const char* input, char* output) {\n  // write your logic here\n  strcpy(output, input);\n}",
  go: "package main\n\nfunc solve(input string) string {\n\t// write your logic here\n\treturn input\n}",
  rust: "fn solve(input: &str) -> String {\n    // write your logic here\n    input.to_string()\n}",
};

const DEFAULT_EXECUTABLE_CODE_BY_LANGUAGE: Record<ProblemLanguage, string> = {
  javascript: "// hidden judge harness for JavaScript",
  typescript: "// hidden judge harness for TypeScript",
  python: "# hidden judge harness for Python",
  java: "// hidden judge harness for Java",
  cpp: "// hidden judge harness for C++",
  c: "// hidden judge harness for C",
  go: "// hidden judge harness for Go",
  rust: "// hidden judge harness for Rust",
};

function createLanguageTemplate(
  language: ProblemLanguage = "javascript",
): DraftLanguageTemplate {
  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`,
    language,
    starterCode: DEFAULT_STARTER_CODE_BY_LANGUAGE[language],
    executableCode: DEFAULT_EXECUTABLE_CODE_BY_LANGUAGE[language],
  };
}

function getAdminBackendUrl() {
  const explicitUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  if (explicitUrl) {
    return explicitUrl.replace(/\/$/, "");
  }

  if (process.env.NODE_ENV === "production") {
    return "https://api.grind.org.in/v1/api";
  }

  return "http://localhost:5000/v1/api";
}

function toSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// Create a separate component for the drag handle
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "header",
    header: "Activity",
    cell: ({ row }) => {
      return <TableCellViewer item={row.original} />;
    },
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: "Category",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.type}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.original.status === "Done" ? (
          <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
        ) : (
          <IconLoader />
        )}
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "target",
    header: () => <div className="w-full text-right">User</div>,
    cell: ({ row }) => (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            loading: `Saving ${row.original.header}`,
            success: "Done",
            error: "Error",
          });
        }}
      >
        <Label htmlFor={`${row.original.id}-target`} className="sr-only">
          User
        </Label>
        <Input
          className="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent"
          defaultValue={row.original.target}
          id={`${row.original.id}-target`}
        />
      </form>
    ),
  },
  {
    accessorKey: "limit",
    header: () => <div className="w-full text-right">Problem</div>,
    cell: ({ row }) => (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            loading: `Saving ${row.original.header}`,
            success: "Done",
            error: "Error",
          });
        }}
      >
        <Label htmlFor={`${row.original.id}-limit`} className="sr-only">
          Problem
        </Label>
        <Input
          className="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent"
          defaultValue={row.original.limit}
          id={`${row.original.id}-limit`}
        />
      </form>
    ),
  },
  {
    accessorKey: "reviewer",
    header: "Admin Reviewer",
    cell: ({ row }) => {
      const isAssigned = row.original.reviewer !== "Assign reviewer";

      if (isAssigned) {
        return row.original.reviewer;
      }

      return (
        <>
          <Label htmlFor={`${row.original.id}-reviewer`} className="sr-only">
            Reviewer
          </Label>
          <Select>
            <SelectTrigger
              className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
              id={`${row.original.id}-reviewer`}
            >
              <SelectValue placeholder="Assign reviewer" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
              <SelectItem value="Jamik Tashpulatov">
                Jamik Tashpulatov
              </SelectItem>
            </SelectContent>
          </Select>
        </>
      );
    },
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Make a copy</DropdownMenuItem>
          <DropdownMenuItem>Favorite</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function DataTable({
  data: initialData,
  defaultView = "user-activity",
}: {
  data: z.infer<typeof schema>[];
  defaultView?: DataTableView;
}) {
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [problemTitle, setProblemTitle] = React.useState("");
  const [problemDescription, setProblemDescription] = React.useState("");
  const [problemSlug, setProblemSlug] = React.useState("");
  const [problemDifficulty, setProblemDifficulty] =
    React.useState<ProblemDifficulty>("EASY");
  const [problemTags, setProblemTags] = React.useState("");
  const [problemMaxPoint, setProblemMaxPoint] = React.useState("100");
  const [languageTemplates, setLanguageTemplates] = React.useState<
    DraftLanguageTemplate[]
  >(() => [createLanguageTemplate("javascript")]);
  const [exampleInput, setExampleInput] = React.useState("");
  const [exampleOutput, setExampleOutput] = React.useState("");
  const [exampleExplanation, setExampleExplanation] = React.useState("");
  const [testCases, setTestCases] = React.useState<DraftTestCase[]>([
    { input: "", output: "" },
  ]);
  const [isCreatingProblem, setIsCreatingProblem] = React.useState(false);
  const [activeView, setActiveView] =
    React.useState<DataTableView>(defaultView);
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data],
  );

  React.useEffect(() => {
    setActiveView(defaultView);
  }, [defaultView]);

  const resetCreateProblemForm = React.useCallback(() => {
    setProblemTitle("");
    setProblemDescription("");
    setProblemSlug("");
    setProblemDifficulty("EASY");
    setProblemTags("");
    setProblemMaxPoint("100");
    setLanguageTemplates([createLanguageTemplate("javascript")]);
    setExampleInput("");
    setExampleOutput("");
    setExampleExplanation("");
    setTestCases([{ input: "", output: "" }]);
  }, []);

  const handleTestCaseChange = React.useCallback(
    (index: number, field: keyof DraftTestCase, value: string) => {
      setTestCases((currentCases) =>
        currentCases.map((testCase, currentIndex) =>
          currentIndex === index ? { ...testCase, [field]: value } : testCase,
        ),
      );
    },
    [],
  );

  const handleAddTestCase = React.useCallback(() => {
    setTestCases((currentCases) => [
      ...currentCases,
      { input: "", output: "" },
    ]);
  }, []);

  const handleRemoveTestCase = React.useCallback((index: number) => {
    setTestCases((currentCases) => {
      if (currentCases.length <= 1) {
        return currentCases;
      }

      return currentCases.filter((_, currentIndex) => currentIndex !== index);
    });
  }, []);

  const handleLanguageTemplateChange = React.useCallback(
    (
      index: number,
      field: keyof Omit<DraftLanguageTemplate, "id">,
      value: string,
    ) => {
      setLanguageTemplates((currentTemplates) =>
        currentTemplates.map((template, currentIndex) =>
          currentIndex === index ? { ...template, [field]: value } : template,
        ),
      );
    },
    [],
  );

  const handleAddLanguageTemplate = React.useCallback(() => {
    setLanguageTemplates((currentTemplates) => {
      const usedLanguages = new Set(
        currentTemplates.map((template) => template.language),
      );
      const nextLanguage =
        LANGUAGE_OPTIONS.find((option) => !usedLanguages.has(option.value))
          ?.value ?? "javascript";

      return [...currentTemplates, createLanguageTemplate(nextLanguage)];
    });
  }, []);

  const handleRemoveLanguageTemplate = React.useCallback((index: number) => {
    setLanguageTemplates((currentTemplates) => {
      if (currentTemplates.length <= 1) {
        return currentTemplates;
      }

      return currentTemplates.filter(
        (_, currentIndex) => currentIndex !== index,
      );
    });
  }, []);

  const handleCreateProblem = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const title = problemTitle.trim();
      const description = problemDescription.trim();
      const slug = (problemSlug.trim() || toSlug(title)).trim();
      const tags = problemTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
      const maxPoint = Number(problemMaxPoint);
      const exampleIn = exampleInput.trim();
      const exampleOut = exampleOutput.trim();
      const normalizedLanguageTemplates = languageTemplates.map((template) => ({
        language: template.language,
        starterCode: template.starterCode.trim(),
        executableCode: template.executableCode.trim(),
      }));
      const normalizedTestCases = testCases
        .map((testCase) => ({
          input: testCase.input.trim(),
          output: testCase.output.trim(),
        }))
        .filter((testCase) => testCase.input && testCase.output);
      const adminToken =
        window.localStorage.getItem("adminToken") ||
        window.localStorage.getItem("token") ||
        "";

      if (!adminToken) {
        toast.error("Admin token not found. Please sign in again.");
        return;
      }

      if (!title || !description || !slug || !exampleIn || !exampleOut) {
        toast.error(
          "Please fill all required fields before creating a problem.",
        );
        return;
      }

      if (!Number.isFinite(maxPoint) || maxPoint <= 0) {
        toast.error("Max point must be a positive number.");
        return;
      }

      if (tags.length === 0) {
        toast.error("Please add at least one tag.");
        return;
      }

      if (normalizedTestCases.length === 0) {
        toast.error("Please add at least one complete test case.");
        return;
      }

      if (normalizedLanguageTemplates.length === 0) {
        toast.error("Please add at least one language template.");
        return;
      }

      const duplicatedLanguage = normalizedLanguageTemplates.find(
        (template, index, templates) =>
          templates.findIndex((item) => item.language === template.language) !==
          index,
      );

      if (duplicatedLanguage) {
        toast.error(
          `Language '${duplicatedLanguage.language}' is duplicated. Add each language once.`,
        );
        return;
      }

      const incompleteTemplate = normalizedLanguageTemplates.find(
        (template) => !template.starterCode || !template.executableCode,
      );

      if (incompleteTemplate) {
        toast.error(
          `Please provide both user code and executable code for '${incompleteTemplate.language}'.`,
        );
        return;
      }

      const starterCodePayload = normalizedLanguageTemplates.map(
        (template) => ({
          language: template.language,
          code: template.starterCode,
        }),
      );

      const executableCodePayload = normalizedLanguageTemplates.map(
        (template) => ({
          language: template.language,
          code: template.executableCode,
        }),
      );

      setIsCreatingProblem(true);

      try {
        const response = await fetch(
          `${getAdminBackendUrl()}/admin/set-challenges`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              token: adminToken,
            },
            body: JSON.stringify({
              title,
              description,
              slug,
              difficulty: problemDifficulty,
              tags,
              maxpoint: maxPoint,
              startercode: JSON.stringify(starterCodePayload),
              exampleinput: exampleIn,
              exampleoutput: exampleOut,
              explanation: exampleExplanation.trim(),
              testcaseinput: normalizedTestCases.map((testCase) => ({
                input: testCase.input,
                output: testCase.output,
                executableCodes: executableCodePayload,
              })),
            }),
          },
        );

        const json = (await response.json().catch(() => null)) as {
          message?: string;
          success?: boolean;
        } | null;

        if (!response.ok || json?.success === false) {
          throw new Error(json?.message || "Failed to create problem.");
        }

        toast.success(json?.message || "Problem created successfully.");
        resetCreateProblemForm();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to create problem.";
        toast.error(errorMessage);
      } finally {
        setIsCreatingProblem(false);
      }
    },
    [
      exampleExplanation,
      exampleInput,
      exampleOutput,
      languageTemplates,
      problemDescription,
      problemDifficulty,
      problemMaxPoint,
      problemSlug,
      problemTags,
      problemTitle,
      resetCreateProblemForm,
      testCases,
    ],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  return (
    <Tabs
      value={activeView}
      onValueChange={(value) => setActiveView(value as DataTableView)}
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select
          value={activeView}
          onValueChange={(value) => setActiveView(value as DataTableView)}
        >
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            id="view-selector"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user-activity">User Activity</SelectItem>
            <SelectItem value="create-problem">Create Problem</SelectItem>
            <SelectItem value="problem-review">Problem Review</SelectItem>
            <SelectItem value="moderation">Moderation</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="user-activity">User Activity</TabsTrigger>
          <TabsTrigger value="create-problem">
            Create Problem <Badge variant="secondary">New</Badge>
          </TabsTrigger>
          <TabsTrigger value="problem-review">
            Problem Review <Badge variant="secondary">7</Badge>
          </TabsTrigger>
          <TabsTrigger value="moderation">Moderation</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide(),
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => setActiveView("create-problem")}
          >
            <IconPlus />
            <span className="hidden lg:inline">Create Problem</span>
          </Button>
        </div>
      </div>
      <TabsContent
        value="user-activity"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent
        value="create-problem"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="w-full rounded-lg border p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Create Problem</h3>
            <p className="text-muted-foreground text-sm">
              Create a coding challenge with multiple language starter and
              executable code templates, plus test cases.
            </p>
          </div>
          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={handleCreateProblem}
          >
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="problem-title">Problem Title</Label>
              <Input
                id="problem-title"
                placeholder="e.g. Two Sum Variants"
                value={problemTitle}
                onChange={(event) => setProblemTitle(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="problem-description">Description</Label>
              <Textarea
                id="problem-description"
                placeholder="Write the problem statement..."
                value={problemDescription}
                onChange={(event) => setProblemDescription(event.target.value)}
                className="min-h-36"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="problem-difficulty">Difficulty</Label>
              <Select
                value={problemDifficulty}
                onValueChange={(value) =>
                  setProblemDifficulty(value as ProblemDifficulty)
                }
              >
                <SelectTrigger id="problem-difficulty" className="w-full">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EASY">Easy</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HARD">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="problem-max-point">Max Point</Label>
              <Input
                id="problem-max-point"
                type="number"
                min={1}
                placeholder="100"
                value={problemMaxPoint}
                onChange={(event) => setProblemMaxPoint(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="problem-slug">Slug</Label>
              <Input
                id="problem-slug"
                placeholder="two-sum-variants"
                value={problemSlug}
                onChange={(event) => setProblemSlug(event.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="problem-tags">Tags (comma separated)</Label>
              <Input
                id="problem-tags"
                placeholder="arrays, hashmap, two pointers"
                value={problemTags}
                onChange={(event) => setProblemTags(event.target.value)}
                required
              />
            </div>

            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center justify-between gap-2">
                <div className="space-y-1">
                  <Label>Language Code Templates</Label>
                  <p className="text-muted-foreground text-xs">
                    Add one section per language with user starter code and
                    hidden executable code.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddLanguageTemplate}
                >
                  <IconPlus className="mr-1.5 size-4" />
                  Add Language
                </Button>
              </div>
              <div className="space-y-3">
                {languageTemplates.map((template, index) => (
                  <div
                    key={template.id}
                    className="rounded-md border bg-muted/10 p-3"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-medium">
                        Language {index + 1}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleRemoveLanguageTemplate(index)}
                        disabled={languageTemplates.length === 1}
                      >
                        <IconTrash className="size-4" />
                        <span className="sr-only">Remove language</span>
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor={`template-language-${index}`}>
                          Language
                        </Label>
                        <Select
                          value={template.language}
                          onValueChange={(value) =>
                            handleLanguageTemplateChange(
                              index,
                              "language",
                              value,
                            )
                          }
                        >
                          <SelectTrigger
                            id={`template-language-${index}`}
                            className="w-full md:w-60"
                          >
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            {LANGUAGE_OPTIONS.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor={`template-starter-code-${index}`}>
                            User Code (Visible Starter Code)
                          </Label>
                          <Textarea
                            id={`template-starter-code-${index}`}
                            placeholder="Starter code shown to users"
                            value={template.starterCode}
                            onChange={(event) =>
                              handleLanguageTemplateChange(
                                index,
                                "starterCode",
                                event.target.value,
                              )
                            }
                            className="min-h-40 font-mono text-xs"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`template-executable-code-${index}`}>
                            Executable Code (Hidden)
                          </Label>
                          <Textarea
                            id={`template-executable-code-${index}`}
                            placeholder="Hidden judge executable code"
                            value={template.executableCode}
                            onChange={(event) =>
                              handleLanguageTemplateChange(
                                index,
                                "executableCode",
                                event.target.value,
                              )
                            }
                            className="min-h-40 font-mono text-xs"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="example-input">Example Input</Label>
              <Textarea
                id="example-input"
                placeholder="nums = [2,7,11,15], target = 9"
                value={exampleInput}
                onChange={(event) => setExampleInput(event.target.value)}
                className="min-h-28"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="example-output">Example Output</Label>
              <Textarea
                id="example-output"
                placeholder="[0,1]"
                value={exampleOutput}
                onChange={(event) => setExampleOutput(event.target.value)}
                className="min-h-28"
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="example-explanation">Example Explanation</Label>
              <Textarea
                id="example-explanation"
                placeholder="Explain why the output is correct"
                value={exampleExplanation}
                onChange={(event) => setExampleExplanation(event.target.value)}
                className="min-h-24"
              />
            </div>

            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center justify-between">
                <Label>Test Cases</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddTestCase}
                >
                  <IconPlus className="mr-1.5 size-4" />
                  Add Test Case
                </Button>
              </div>
              <div className="space-y-3">
                {testCases.map((testCase, index) => (
                  <div
                    key={`test-case-${index}`}
                    className="rounded-md border bg-muted/10 p-3"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-medium">
                        Test Case {index + 1}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleRemoveTestCase(index)}
                        disabled={testCases.length === 1}
                      >
                        <IconTrash className="size-4" />
                        <span className="sr-only">Remove test case</span>
                      </Button>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`test-case-input-${index}`}>
                          Input
                        </Label>
                        <Textarea
                          id={`test-case-input-${index}`}
                          placeholder="Input"
                          value={testCase.input}
                          onChange={(event) =>
                            handleTestCaseChange(
                              index,
                              "input",
                              event.target.value,
                            )
                          }
                          className="min-h-24"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`test-case-output-${index}`}>
                          Expected Output
                        </Label>
                        <Textarea
                          id={`test-case-output-${index}`}
                          placeholder="Expected output"
                          value={testCase.output}
                          onChange={(event) =>
                            handleTestCaseChange(
                              index,
                              "output",
                              event.target.value,
                            )
                          }
                          className="min-h-24"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={resetCreateProblemForm}
                disabled={isCreatingProblem}
              >
                Reset
              </Button>
              <Button type="submit" disabled={isCreatingProblem}>
                {isCreatingProblem ? (
                  <>
                    <IconLoader className="mr-2 size-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Problem"
                )}
              </Button>
            </div>
          </form>
        </div>
      </TabsContent>
      <TabsContent
        value="problem-review"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent value="moderation" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
    </Tabs>
  );
}

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.header}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.header}</DrawerTitle>
          <DrawerDescription>
            Review and update admin activity metadata.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && (
            <>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 0,
                    right: 10,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                    hide
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="mobile"
                    type="natural"
                    fill="var(--color-mobile)"
                    fillOpacity={0.6}
                    stroke="var(--color-mobile)"
                    stackId="a"
                  />
                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 leading-none font-medium">
                  User activity rose by 5.2% this month{" "}
                  <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">
                  Snapshot of engagement trends to support moderation and
                  content decisions.
                </div>
              </div>
              <Separator />
            </>
          )}
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">Activity</Label>
              <Input id="header" defaultValue={item.header} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="type">Category</Label>
                <Select defaultValue={item.type}>
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Submission">Submission</SelectItem>
                    <SelectItem value="Problem Creation">
                      Problem Creation
                    </SelectItem>
                    <SelectItem value="Contest">Contest</SelectItem>
                    <SelectItem value="Moderation">Moderation</SelectItem>
                    <SelectItem value="User Report">User Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={item.status}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Done">Done</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="target">User</Label>
                <Input id="target" defaultValue={item.target} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="limit">Problem</Label>
                <Input id="limit" defaultValue={item.limit} />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="reviewer">Admin Reviewer</Label>
              <Select defaultValue={item.reviewer}>
                <SelectTrigger id="reviewer" className="w-full">
                  <SelectValue placeholder="Select a reviewer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aarav Shah">Aarav Shah</SelectItem>
                  <SelectItem value="Meera Rao">Meera Rao</SelectItem>
                  <SelectItem value="Kunal Verma">Kunal Verma</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
