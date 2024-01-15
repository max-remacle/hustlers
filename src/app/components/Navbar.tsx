//TODO: update styling
"use client";
import React, { useState } from "react";
import { Button, Drawer, Menu, Typography } from "antd";
import {
  EuroOutlined,
  HeartOutlined,
  BarsOutlined,
  MenuOutlined,
  CalculatorOutlined,
} from "@ant-design/icons";
import styles from "./Navbar.module.css";
import { Header } from "antd/es/layout/layout";

const { Title } = Typography;

const items = [
  {
    key: "1",
    label: "Dashboard",
  },
  {
    key: "2",
    label: "Games",
  },
  {
    key: "3",
    label: "Leaderboard",
  },
  {
    key: "4",
    label: "Profile",
  },
];

const Navbar: React.FC = (props) => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible((visible) => !visible);
  };
  return (
    <>
      <Header className={styles.bigmenu}>
        <Title style={{ color: "white", marginBottom: 0 }}>Hustlers</Title>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          items={items}
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
          <Button type="text" href="/finances" icon={<EuroOutlined />}>
            Finances
          </Button>

          <Button type="text" href="/sante" icon={<HeartOutlined />}>
            Santé
          </Button>
          <Button
            type="text"
            href="/mathematiques"
            icon={<CalculatorOutlined />}
          >
            Mathématiques
          </Button>
          <Button type="text" href="/autres" icon={<BarsOutlined />}>
            Autres
          </Button>
        </div>
      </Drawer>
    </>
  );
};

export default Navbar;
