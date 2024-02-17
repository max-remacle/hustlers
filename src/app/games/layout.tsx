"use client";

import { useUser } from "../lib/auth";
import { ReactNode } from "react";
import { redirect  } from "next/navigation";
import { Spin } from "antd";

export default function Layout({ children }: { children: ReactNode }) {

  const user = useUser();

  if (user === false) return (
    <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
      <Spin size="large" />
    </div>
  )
  if (!user) {
    redirect("/");
  }
  return children;
}
