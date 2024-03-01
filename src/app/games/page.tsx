"use client";
import { useEffect, useMemo, useState } from "react";
import { Row, Col } from "antd";
import GameDetails from "../components/GameDetails";
import styles from "./page.module.css";
import { db } from "../lib/Firebase";
import {
  collection,
  getDocs,
  query,
} from "firebase/firestore";
import { useGameStore } from "../store/game";
import { Game } from "../lib/types/Game";

export default function Page() {
  const games = useGameStore((state: any) => state.games);
  const updateGames = useGameStore((state: any) => state.updateGames);

  useEffect(() => {
    if (games.length > 0) return;
    const fetchGames = async () => {
      const gamesRef = collection(db, "games");
      const gamesSnapshot = await getDocs(query(gamesRef));
      const games = gamesSnapshot.docs.map((doc) => {
        const game = doc.data();
        game.id = doc.id;
        return game as Game;
      });
      updateGames(games);
    };
    fetchGames();
  },[games]);

  const sortedAndFilteredGames = useMemo(() => {
    return games
      .filter((game: Game) => game.played === true)
      .sort((a: Game, b: Game) => b.date.seconds - a.date.seconds);
  }, [games]);

  return (
    <main className={styles.container}>
      <Row className={styles.row} justify="start" gutter={[16, 16]}>
        {sortedAndFilteredGames.map((game: Game) => (
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
