"use client";
import { useEffect, useState } from "react";
import { List, Typography } from "antd";
import PlayerTable from "@/app/components/PlayerTable";
import { format } from "date-fns";

import { getDisplayName } from "../../lib/utilities/Namemap";
import { Game } from "@/app/lib/types/Game";
import data from "../../../../games.json";
import styles from "./page.module.css";

const { Text } = Typography;

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  const [game, setGame] = useState<Game>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const formatDate = (game: Game) => {
    if (game) {
      const date = new Date(game.date.seconds * 1000);
      const formattedDate = format(date, "MMMM do, yyyy, h:mm a");
      return formattedDate;
    }
  };
  
  useEffect(() => {
    setIsLoading(true);
    const game = data.find((game) => game.id === params.id);
    setGame(game);
    setIsLoading(false);
  }, [params.id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className={styles.container}>
      <div className={styles.banner}>
        <div className={styles.scoreDiv}>
          {game?.played ? (
            <>
              <div>
                <Text className={styles.scoreText}>Hustlers</Text>
              </div>
              <div>
                <Text
                  className={styles.scoreText}
                >{`${game?.teamScore} : ${game?.opponentScore}`}</Text>
              </div>
              <div>
                <Text className={styles.scoreText}>
                  {game && getDisplayName(game.opponent)}
                </Text>
              </div>
            </>
          ) : (
            <Text className={styles.scoreText}>
              {game && getDisplayName(game.opponent)}
            </Text>
          )}
        </div>
        {game?.played ? (
          <Text className={styles.dateText}>Full-Time</Text>
        ) : (
          <>
            <Text className={styles.dateText}>{formatDate(game!)}</Text>
            <Text className={styles.locationText}>{game?.field}</Text>
          </>
        )}
      </div>
      <div className={styles.detailsTextWrapper}>
        {game?.played ? (
          <>
            <div>
              <div className={styles.detailsTitletDiv}>
                <Text className={styles.detailsTitle}>Location</Text>
              </div>
              <div className={styles.detailsTextDiv}>
                <Text className={styles.detailsText}>{game?.field}</Text>
              </div>
            </div>
            <div>
              <div className={styles.detailsTitletDiv}>
                <Text className={styles.detailsTitle}>Dick of the Day</Text>
              </div>
              <div className={styles.detailsTextDiv}>
                <Text className={styles.detailsText}>{game?.dod}</Text>
              </div>
            </div>
            <div>
              <div className={styles.detailsTitletDiv}>
                <Text className={styles.detailsTitle}>Drink time</Text>
              </div>
              <div className={styles.detailsTextDiv}>
                <Text className={styles.detailsText}>{game?.dodTime}</Text>
              </div>
            </div>
            <div className={styles.playersDiv}>
              <Text className={styles.detailsTitle}>Players</Text>
              <div className={styles.listWrapper}>
                <List
                  dataSource={game.confirmedPlayers}
                  renderItem={(name) => (
                    <List.Item className={styles.listText}>{name}</List.Item>
                  )}
                  grid={{ column: 3, gutter: 16 }}
                />
              </div>
            </div>
          </>
        ) : (
          <div>
            <PlayerTable
              game={game}
            />
          </div>
        )}
      </div>
    </main>
  );
}
