//TODO: update styling
"use client";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button, ConfigProvider, Drawer, Menu, Typography, theme } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import styles from "./Navbar.module.css";
import { Header } from "antd/es/layout/layout";
import { signOut } from "../lib/auth";
import Link from "next/link";

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
      return;
    }
    const { target } = items.find((item) => item.key === key) || {};
    if (target) {
      router.push(target);
    }
  };

  const currentKey = items.find((item) => item.target === pathname)?.key;
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <Header className={styles.bigmenu}>
        <Link href={`/`}>
          <Title style={{ color: "white", marginBottom: 0 }}>Hustlers</Title>
        </Link>
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
        <Link href={`/`}>
          <Title style={{ color: "white", marginBottom: 0 }}>Hustlers</Title>
        </Link>
        <Button
          className={styles.menubtn}
          size="large"
          icon={<MenuOutlined />}
          onClick={showDrawer}
        ></Button>
      </div>
      <Drawer
        title={<Title className={styles.mobileTitle}>Hustlers</Title>}
        size="large"
        placement="right"
        closable={true}
        onClose={showDrawer}
        open={visible}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Button className={styles.mobileText} type="text" href="/">
            Dashboard
          </Button>
          <Button className={styles.mobileText} type="text" href="/games">
            Games
          </Button>
          <Button className={styles.mobileText} type="text" href="/leaderboard">
            Leaderboard
          </Button>
          <Button
            className={styles.mobileText}
            type="text"
            onClick={() => signOut()}
          >
            Log Out
          </Button>
        </div>
      </Drawer>
    </ConfigProvider>
  );
};

export default Navbar;
