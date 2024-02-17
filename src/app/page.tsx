"use client";
import { useEffect, useState } from "react";
import { Row, Col, Spin, Modal } from "antd";
import GameDetails from "./components/GameDetails";
import styles from "./page.module.css";
import { auth, db } from "./lib/Firebase";
import {
  collection,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import data from "../../games.json";
import Title from "antd/es/typography/Title";
import TrainingDetails from "./components/TrainingDetails";
import { useUser } from "./lib/auth";
import Auth from "./components/Auth";
export default function Home() {
  const user = useUser();
  const [games, setGames] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState(true);
  console.log(user);

  if (user === false)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const modalStyles = {
    mask: {
      backdropFilter: "blur(20px)",
    },
    content: {
      backgroundColor: "#181818",
    },
  };

  // useEffect(() => {
  //   async function getGamesAndPlayers() {
  //     const gamesSnapshot = await getDocs(collection(db, "games"));
  //     const games = [];

  //     for (const gameDoc of gamesSnapshot.docs) {
  //       const gameData = gameDoc.data();
  //       const players = [];

  //       for (const playerRef of gameData.players) {
  //         const playerSnapshot = await getDoc(playerRef);
  //         const playerData: any = playerSnapshot.data();
  //         players.push(playerData.firstName);
  //       }
  //       games.push({
  //         ...gameData,
  //         players,
  //       });
  //     }
  //     console.log(games);

  //     setGames(games);
  //   }

  //   getGamesAndPlayers();
  // }, []);

  // useEffect(() => {
  //   async function getAllDocuments() {
  //     const querySnapshot = await getDocs(collection(db, "games"));

  //     const documents:any = querySnapshot.docs.map(doc => doc.data());

  //     // return documents;
  //     console.log(documents);
  //   }

  //   getAllDocuments();
  // }, []);

  if (user) {
    return (
      <main className={styles.container}>
        <div className={styles.cardContainer}>
          <Title className={styles.title} level={2}>
            Upcoming Game
          </Title>
          <GameDetails game={data[3]} />
        </div>
        <div className={styles.cardContainer}>
          <Title className={styles.title} level={2}>
            Upcoming Training
          </Title>
          <TrainingDetails />
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <Modal
        className={styles.modal}
        destroyOnClose
        maskClosable={false}
        styles={modalStyles}
        open={isModalOpen}
        closeIcon={false}
        closable={false}
        footer={null}
      >
        <Auth />
      </Modal>
    </main>
  );
}
