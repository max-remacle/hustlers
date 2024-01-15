"use client";
import { useEffect, useState } from "react";
import { Row, Col } from "antd";
import GameDetails from "./components/GameDetails";
import styles from "./page.module.css";
import { db } from "./lib/Firebase";
import {
  collection,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import data from "../../games.json";

export default function Home() {
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

  // useEffect(() => {
  //   async function getAllDocuments() {
  //     const querySnapshot = await getDocs(collection(db, "games"));
      
  //     const documents:any = querySnapshot.docs.map(doc => doc.data());
      
  //     // return documents;
  //     console.log(documents);
  //   }

  //   getAllDocuments();
  // }, []);

  return (
    <main className={styles.container}>
      <Row className={styles.row} justify="center" gutter={[16,16]}>
        {data.map((game) => (
          <Col xs={24} sm={24} md={12} key={game.id}>
            <div className={styles.centeredCard}>
              <GameDetails game={game} />
            </div>
          </Col>
        ))}
      </Row>
    </main>
  );
}
