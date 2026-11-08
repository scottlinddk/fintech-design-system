"use client";
import { useState } from "react";
import { Button, Field, Input, Menu } from "@scttlnd/fintech-design-system";

export function ClientExample() {
  const [message, setMessage] = useState("Ready");
  return (
    <>
      <Button onClick={() => setMessage("Button hydrated")}>Try button</Button>
      <p role="status">{message}</p>
      <Field label="Smoke name" hint="Type a label.">
        {(control) => <Input {...control} />}
      </Field>
      <Menu
        ariaLabel="Smoke actions"
        items={[{ label: "Choose item", onSelect: () => setMessage("Menu hydrated") }]}
      />
    </>
  );
}
