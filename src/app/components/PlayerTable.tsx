"use client";
import React, { useEffect, useState } from "react";
import { Badge, Table, Tag } from "antd";

import styles from "./PlayerTable.module.css";
import { Player } from "../lib/types/Player";
import { Game } from "../lib/types/Game";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/Firebase";

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
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const { confirmedPlayers, declinedPlayers } = game;

  const renderPlayerName = (text: string, record: Player) => {
    const playerId = record.id;

    let status = "default";
    if (confirmedPlayers.some((obj) => obj.id === playerId)) {
      status = "success";
    } else if (declinedPlayers.some((obj) => obj.id === playerId)) {
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

  useEffect(() => {
    async function getPlayers() {
      const querySnapshot = await getDocs(collection(db, "players"));
      const players = querySnapshot.docs.map((doc) => doc.data());
      setAllPlayers(players as Player[]);
    }
    getPlayers();
  }, []);

  const sortedPlayers: Player[] = allPlayers
    .sort((a, b) => {
      const aId = a.id;
      const bId = b.id;

      const aIsConfirmed = confirmedPlayers.some((obj) => obj.id === aId);
      const aIsDeclined = declinedPlayers.some((obj) => obj.id === aId);
      const bIsConfirmed = confirmedPlayers.some((obj) => obj.id === bId);
      const bIsDeclined = declinedPlayers.some((obj) => obj.id === bId);

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
      const rideRequest = game.rideRequests.some((obj) => obj.id === player.id);
      const rideOffer = game.rideOffers.some((obj) => obj.id === player.id);
      return {
        ...player,
        rideRequest,
        rideOffer,
      };
    });

  return (
    <Table
      className={styles.table}
      pagination={false}
      dataSource={sortedPlayers}
      columns={columns}
      rowKey={(record) => record.id}
    />
  );
};

export default PlayerTable;
