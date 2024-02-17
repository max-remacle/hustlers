import React from "react";
import { Card, Typography } from "antd";
import { Training } from "../lib/types/Training";
import { format } from "date-fns";
import styles from "./TrainingDetails.module.css";

const { Text } = Typography;

interface TrainingDetailsProps {
  training: Training;
}

const TrainingDetails: React.FC<TrainingDetailsProps> = (props) => {
  const training = {
    id: "1",
    field: "Monrad",
    date: {
      seconds: 1705107600,
      nanoseconds: 804000000,
    },
    cancelled: false,
    confirmedPlayers: [
      "Max Remacle",
      "Shannon Mickleburgh",
      "Adam Harris",
      "Ryan Stockley",
      "Craig Van Stratum",
    ],
    declinedPlayers: ["Josh Brown", "Dave Burrows"],
  };

  const date = new Date(training.date.seconds * 1000);
  const formattedDate = format(date, "MMMM do, yyyy, h:mm a");

  let cardColour = "#ebebd3";

  if (training.cancelled) {
    cardColour = "rgba(158, 0, 0,1";
  }

  return (
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
        {training.cancelled ? (
          <Text underline className={styles.title}>
            Training Cancelled
          </Text>
        ) : (
          <>
            <Text underline className={styles.title}>
              {training.field}
            </Text>
            <Text className={styles.date}>{formattedDate}</Text>
            <div>
              <Text className={styles.score}>
                <Text className={styles.score} underline>
                  Confirmed Players
                </Text>
                {` ${training.confirmedPlayers.length}`}
              </Text>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default TrainingDetails;
