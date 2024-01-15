"use client";
import { useEffect, useState } from "react";
import { Row, Col } from "antd";
import GameDetails from "../components/GameDetails";
import styles from "./page.module.css";
import { db } from "../lib/Firebase";
import {
  collection,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import data from "../../../games.json";

export default function Page() {
  const [games, setGames] = useState<any>([]);
  console.log("rerender");

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

  return (
    <main className={styles.container}>
      <Row className={styles.row} justify="start" gutter={[16, 16]}>
        {data
          .sort((a, b) => b.date.seconds - a.date.seconds)
          .map((game) => (
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={8} key={game.id}>
              <div className={styles.centeredCard}>
                <GameDetails game={game} />
              </div>
            </Col>
          ))}
      </Row>
    </main>
  );
}
