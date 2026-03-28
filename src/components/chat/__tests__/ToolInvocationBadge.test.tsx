import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ToolInvocationBadge } from "../ToolInvocationBadge";

test("shows 'Creating <filename>' for str_replace_editor create command", () => {
  render(
    <ToolInvocationBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "/components/Button.jsx" }}
      state="call"
    />
  );

  expect(screen.getByText("Creating Button.jsx")).toBeDefined();
});

test("shows 'Editing <filename>' for str_replace_editor str_replace command", () => {
  render(
    <ToolInvocationBadge
      toolName="str_replace_editor"
      args={{ command: "str_replace", path: "/components/Card.tsx" }}
      state="call"
    />
  );

  expect(screen.getByText("Editing Card.tsx")).toBeDefined();
});

test("shows 'Editing <filename>' for str_replace_editor insert command", () => {
  render(
    <ToolInvocationBadge
      toolName="str_replace_editor"
      args={{ command: "insert", path: "/App.jsx" }}
      state="call"
    />
  );

  expect(screen.getByText("Editing App.jsx")).toBeDefined();
});

test("shows 'Reading <filename>' for str_replace_editor view command", () => {
  render(
    <ToolInvocationBadge
      toolName="str_replace_editor"
      args={{ command: "view", path: "/utils/helpers.ts" }}
      state="result"
    />
  );

  expect(screen.getByText("Reading helpers.ts")).toBeDefined();
});

test("shows 'Renaming <filename>' for file_manager rename command", () => {
  render(
    <ToolInvocationBadge
      toolName="file_manager"
      args={{ command: "rename", path: "/old.jsx", new_path: "/new.jsx" }}
      state="call"
    />
  );

  expect(screen.getByText("Renaming to new.jsx")).toBeDefined();
});

test("shows 'Deleting <filename>' for file_manager delete command", () => {
  render(
    <ToolInvocationBadge
      toolName="file_manager"
      args={{ command: "delete", path: "/components/Old.tsx" }}
      state="call"
    />
  );

  expect(screen.getByText("Deleting Old.tsx")).toBeDefined();
});

test("shows a spinner when state is not 'result'", () => {
  const { container } = render(
    <ToolInvocationBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "/Button.jsx" }}
      state="call"
    />
  );

  expect(container.querySelector(".animate-spin")).toBeDefined();
});

test("shows a green dot when state is 'result'", () => {
  const { container } = render(
    <ToolInvocationBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "/Button.jsx" }}
      state="result"
    />
  );

  const dot = container.querySelector(".bg-emerald-500");
  expect(dot).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

test("handles missing path gracefully", () => {
  render(
    <ToolInvocationBadge
      toolName="str_replace_editor"
      args={{ command: "create" }}
      state="call"
    />
  );

  expect(screen.getByText("Creating")).toBeDefined();
});

test("falls back to tool name for unknown tools", () => {
  render(
    <ToolInvocationBadge
      toolName="unknown_tool"
      args={{}}
      state="call"
    />
  );

  expect(screen.getByText("unknown_tool")).toBeDefined();
});
