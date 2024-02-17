"use client";
import React, { useEffect } from "react";
import { Badge, ConfigProvider, Table, Tag, theme } from "antd";

import styles from "./PlayerTable.module.css";
import allPlayers from "../../../players.json";
import { Player } from "../lib/types/Player";
import { Game } from "../lib/types/Game";

interface PlayerTableProps {
  game: Game;
}

type BadgeStatusType =
  | "processing"
  | "success"
  | "error"
  | "warning"
  | "default";

const PlayerTable: React.FC<PlayerTableProps> = ({ game }) => {
  const { confirmedPlayers, declinedPlayers } = game;

  const renderPlayerName = (text: string, record: Player) => {
    const playerName = `${record.firstName} ${record.lastName}`;
    let status = "default";
    if (confirmedPlayers.includes(playerName)) {
      status = "success";
    } else if (declinedPlayers.includes(playerName)) {
      status = "error";
    }
    return (
      <Badge
        status={status as BadgeStatusType}
        text={`${record.firstName} ${record.lastName}`}
      />
    );
  };

  const columns = [
    {
      title: `Confirmed Players: ${confirmedPlayers.length}`,
      dataIndex: "firstName",
      key: "name",
      width: "70%",
      render: renderPlayerName,
    },
    {
      title: "Ride Request",
      dataIndex: "rideRequest",
      key: "rideRequest",
      render: (rideRequest: boolean) => (
        <Tag color={rideRequest ? "green" : "default"}>
          {rideRequest ? "Yes" : "No"}
        </Tag>
      ),
    },
    {
      title: "Ride Offer",
      dataIndex: "rideOffer",
      key: "rideOffer",
      render: (rideOffer: boolean) => (
        <Tag color={rideOffer ? "green" : "default"}>
          {rideOffer ? "Yes" : "No"}
        </Tag>
      ),
    },
  ];

  // useEffect(() => {
  //   console.log(allPlayers);
  //   console.log(confirmedPlayers);
  // }, [confirmedPlayers]);

  // const sortedPlayers = [...allPlayers].sort((a, b) => {
  //   const aIsConfirmed = confirmedPlayers.includes(a.firstName);
  //   const aIsDeclined = declinedPlayers.includes(a.firstName);
  //   const bIsConfirmed = confirmedPlayers.includes(b.firstName);
  //   const bIsDeclined = declinedPlayers.includes(b.firstName);

  //   if (aIsConfirmed && !bIsConfirmed) {
  //     return -1;
  //   }
  //   if (!aIsConfirmed && bIsConfirmed) {
  //     return 1;
  //   }
  //   if (aIsDeclined && !bIsDeclined) {
  //     return -1;
  //   }
  //   if (!aIsDeclined && bIsDeclined) {
  //     return 1;
  //   }
  //   return 0;
  // });

  const sortedPlayers: Player[] = allPlayers
    .sort((a, b) => {
      const aName = `${a.firstName} ${a.lastName}`;
      const bName = `${b.firstName} ${b.lastName}`;

      const aIsConfirmed = confirmedPlayers.includes(aName);
      const aIsDeclined = declinedPlayers.includes(aName);
      const bIsConfirmed = confirmedPlayers.includes(bName);
      const bIsDeclined = declinedPlayers.includes(bName);

      if (aIsConfirmed && !bIsConfirmed) {
        return -1;
      }
      if (!aIsConfirmed && bIsConfirmed) {
        return 1;
      }
      if (aIsDeclined && !bIsDeclined) {
        return -1;
      }
      if (!aIsDeclined && bIsDeclined) {
        return 1;
      }
      return 0;
    })
    .map((player) => {
      const playerName = `${player.firstName} ${player.lastName}`;
      const rideRequest = game.rideRequests.includes(playerName);
      const rideOffer = game.rideOffers.includes(playerName);
      return {
        ...player,
        rideRequest,
        rideOffer,
      };
    });

  console.log(sortedPlayers);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <Table
        className={styles.table}
        pagination={false}
        dataSource={sortedPlayers}
        columns={columns}
      />
    </ConfigProvider>
  );
};

export default PlayerTable;
