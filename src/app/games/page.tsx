"use client";
import { useEffect, useMemo, useState } from "react";
import { Row, Col, Switch, Divider, Typography } from "antd";
import GameDetails from "../components/GameDetails";
import styles from "./page.module.css";
import { db } from "../lib/Firebase";
import { collection, getDocs, query } from "firebase/firestore";
import { useGameStore } from "../store/game";
import { Game } from "../lib/types/Game";

const { Text } = Typography;

export default function Page() {
  const [playedGames, setPlayedGames] = useState<boolean>(false);
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
  }, [games]);

  const sortedAndFilteredGames = useMemo(() => {
    return games
      .filter((game: Game) => game.played === playedGames)
      .sort((a: Game, b: Game) => {
        if (playedGames) return b.date.seconds - a.date.seconds;
        return a.date.seconds - b.date.seconds;
      });
  }, [games, playedGames]);

  return (
    <main className={styles.container}>
      <Text className={styles.switchText}>
        {playedGames ? "View Upcoming Games" : "View Played Games"}
      </Text>
      <Switch onChange={() => setPlayedGames((prev) => !prev)} />
      <Divider style={{ background: "whitesmoke" }} />
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
