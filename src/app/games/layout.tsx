"use client";

import { useUser } from "../lib/auth";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Spin } from "antd";
import SpinComponent from "../components/Spin";

export default function Layout({ children }: { children: ReactNode }) {
  const user = useUser();

  if (user === false) return <SpinComponent />;
  if (!user) {
    redirect("/");
  }
  return children;
}
