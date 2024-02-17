//TODO: update styling
"use client";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button, Drawer, Menu, Typography } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import styles from "./Navbar.module.css";
import { Header } from "antd/es/layout/layout";
import { signOut } from "../lib/auth";

const { Title } = Typography;

const items = [
  {
    key: "1",
    label: "Dashboard",
    target: "/",
  },
  {
    key: "2",
    label: "Games",
    target: "/games",
  },
  {
    key: "3",
    label: "Leaderboard",
    target: "/leaderboard",
  },
  {
    key: "4",
    label: "Log Out",
  },
];

const Navbar: React.FC = (props) => {
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible((visible) => !visible);
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "4") {
      signOut();
      router.push("/");
      return;
    }
    const { target } = items.find((item) => item.key === key) || {};
    if (target) {
      router.push(target);
    }
  };

  const currentKey = items.find((item) => item.target === pathname)?.key;
  return (
    <>
      <Header className={styles.bigmenu}>
        <Title style={{ color: "white", marginBottom: 0 }}>Hustlers</Title>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          selectedKeys={[currentKey!]}
          items={items}
          onClick={handleMenuClick}
          style={{ flex: 1, minWidth: 0, justifyContent: "flex-end" }}
        />
      </Header>
      <div className={styles.mobileNav}>
        <Title style={{ color: "white", marginBottom: 0 }}>Hustlers</Title>
        <Button
          className={styles.menubtn}
          size="large"
          icon={<MenuOutlined />}
          onClick={showDrawer}
        ></Button>
      </div>
      <Drawer
        title={<Title style={{ textAlign: "center" }}>Hustlers</Title>}
        size="large"
        placement="right"
        closable={true}
        onClose={showDrawer}
        open={visible}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Button type="text" href="/">
            Dashboard
          </Button>
          <Button type="text" href="/games">
            Games
          </Button>
          <Button type="text" href="/leaderboard">
            Leaderboard
          </Button>
          <Button type="text" href="/profile">
            Profile
          </Button>
        </div>
      </Drawer>
    </>
  );
};

export default Navbar;
