import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Card, Divider, Typography } from "antd";
import styles from "./GameDetails.module.css";
import { Game } from "../lib/types/Game";
import { getDisplayName } from "../lib/utilities/Namemap";
import SpinComponent from "./Spin";

const { Text } = Typography;

interface GameDetailsProps {
  game: Game;
}

const GameDetails: React.FC<GameDetailsProps> = (props) => {
  const { game } = props;

  const date = new Date(game.date.seconds * 1000);
  const formattedDate = format(date, "MMMM do, yyyy, h:mm a");

  let cardColour = "#ebebd3";

  if (game.teamScore > game.opponentScore) {
    cardColour = "rgba(0, 102, 0,1)";
  } else if (game.teamScore == game.opponentScore && game.played) {
    cardColour = "rgba(94, 94, 94,1)";
  } else if (game.teamScore < game.opponentScore) {
    cardColour = "rgba(158, 0, 0,1)";
  }

  return (
    <Link
      style={{ minWidth: "100%", minHeight: "100%" }}
      href={`/games/${game.id}`}
    >
      <Card
        bodyStyle={{ padding: "24px 5px" }}
        style={{
          backgroundColor: "#131313",
          border: `2px solid ${cardColour}`,
          boxShadow: `5px 5px 15px ${cardColour}`,
        }}
        className={styles.card}
        bordered={false}
      >
        <div className={styles.headingContainer}>
          <Text underline className={styles.title}>
            {getDisplayName(game.opponent)}
          </Text>
          <Text className={styles.date}>{formattedDate}</Text>
          <Text className={styles.date}>{game.field}</Text>
          <div>
            {game.played ? (
              <>
                <Text className={styles.score}>Hustlers</Text>
                <Text className={styles.score}>
                  {`${game.teamScore} - ${game.opponentScore}`}
                </Text>
                <Text className={styles.score}>
                  {getDisplayName(game.opponent)}
                </Text>
              </>
            ) : (
              <Text className={styles.score}>
                <Text className={styles.score} underline>
                  Confirmed Players
                </Text>
                {` ${game.confirmedPlayers.length}`}
              </Text>
            )}
          </div>
        </div>
        {game.played && (
          <>
            <Divider style={{ borderTop: "2px solid white" }} />
            <div className={styles.contentContainer}>
              <div className={styles.pair}>
                <Text underline strong className={styles.text}>
                  Location
                </Text>
                <Text className={styles.text}>{game.field}</Text>
              </div>
              <div className={styles.pair}>
                <Text underline strong className={styles.text}>
                  Dick of the Day
                </Text>
                <Text className={styles.text}>{game.dod}</Text>
              </div>
              <div className={styles.pair}>
                <Text underline strong className={styles.text}>
                  Drink Time
                </Text>
                <Text className={styles.text}>{game.dodTime}</Text>
              </div>
            </div>
          </>
        )}
      </Card>
    </Link>
  );
};

export default GameDetails;
