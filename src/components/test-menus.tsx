"use client";
import * as Dropdown from "@radix-ui/react-dropdown-menu";

export default function RadixMenuSmokeTest() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <button style={{ padding: 8, border: "1px solid #ccc" }}>Open</button>
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content
          sideOffset={4}
          style={{
            background: "white",
            color: "black",
            border: "1px solid #ddd",
            padding: 8,
            zIndex: 9999,
          }}
        >
          <Dropdown.Item style={{ padding: 6 }}>Light</Dropdown.Item>
          <Dropdown.Item style={{ padding: 6 }}>Dark</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
}
