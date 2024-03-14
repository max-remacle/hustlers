"use client";
import SpinComponent from "@/app/components/Spin";
import React, { useState, useEffect } from "react";
import { ConfigProvider, Form, Select, Typography, theme } from "antd";
import PlayerTable from "@/app/components/PlayerTable";
import { format } from "date-fns";
import { Training } from "@/app/lib/types/Training";
import {
  DocumentData,
  DocumentReference,
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/app/lib/Firebase";

const { Text } = Typography;

import styles from "./page.module.css";
import { useUser } from "@/app/lib/auth";

interface PageProps {
  params: {
    id: string;
  };
}

const formatDate = (training: Training) => {
  if (training) {
    const date = new Date(training.date.seconds * 1000);
    const formattedDate = format(date, "MMMM do, yyyy, h:mm a");
    return formattedDate;
  }
};

export default function Page({ params }: PageProps) {
  const user = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [training, setTraining] = useState<Training>();

  useEffect(() => {
    const docRef = doc(db, "trainings", params.id);

    const unsubscribe = onSnapshot(docRef, async (docSnap) => {
      if (docSnap.exists()) {
        const trainingData = docSnap.data() as Training;
        const confirmedPlayers = docSnap.data().confirmedPlayers || [];
        const declinedPlayers = docSnap.data().declinedPlayers || [];

        const playerDataPromises = confirmedPlayers.map(
          async (playerRef: DocumentReference<unknown, DocumentData>) => {
            const playerSnap = await getDoc(playerRef);
            return playerSnap.data();
          }
        );

        const declinedPlayerDataPromises = declinedPlayers.map(
          async (playerRef: DocumentReference<unknown, DocumentData>) => {
            const playerSnap = await getDoc(playerRef);
            return playerSnap.data();
          }
        );

        const playersData = await Promise.all(playerDataPromises);
        const declinedPlayersData = await Promise.all(
          declinedPlayerDataPromises
        );

        trainingData.confirmedPlayers = playersData;
        trainingData.declinedPlayers = declinedPlayersData;

        setTraining(trainingData);
        setIsLoading(false);
      } else {
        console.log("No such document!");
      }
    });
    return () => unsubscribe();
  }, [params.id]);

  const handleSelectChange = async (value: string) => {
    const trainingRef = doc(db, "trainings", params.id);
    const userRef = doc(db, "players", user.uid);

    if (value === "confirmed") {
      await updateDoc(trainingRef, {
        confirmedPlayers: arrayUnion(userRef),
        declinedPlayers: arrayRemove(userRef),
      });
    } else if (value === "declined") {
      await updateDoc(trainingRef, {
        confirmedPlayers: arrayRemove(userRef),
        declinedPlayers: arrayUnion(userRef),
      });
    }
  };

  const handleCancel = async (value: boolean) => {
    const trainingRef = doc(db, "trainings", params.id);

    if (value === true) {
      await updateDoc(trainingRef, {
        cancelled: true,
      });
    } else if (value === false) {
      await updateDoc(trainingRef, {
        cancelled: false,
      });
    }
  };

  return (
    <main className={styles.container}>
      {isLoading ? (
        <SpinComponent />
      ) : (
        <>
          <div className={styles.banner}>
            <div className={styles.scoreDiv}>
              {training!.cancelled ? (
                <Text className={styles.scoreText}>Training Cancelled</Text>
              ) : (
                <Text className={styles.scoreText}>{training!.field}</Text>
              )}
            </div>
            {!training!.cancelled && (
              <Text className={styles.dateText}>{formatDate(training!)}</Text>
            )}
          </div>
          <div className={styles.detailsTextWrapper}>
            <ConfigProvider
              theme={{
                algorithm: theme.darkAlgorithm,
              }}
            >
              <div className={styles.tableAndInputWrapper}>
                <Form layout="vertical" className={styles.form}>
                  <Form.Item
                    className={styles.formItem}
                    label={
                      <Text className={styles.detailsText} strong>
                        Availibility
                      </Text>
                    }
                  >
                    <Select
                      style={{ width: "100%" }}
                      onChange={(value) => handleSelectChange(value)}
                      options={[
                        { label: "Confirmed", value: "confirmed" },
                        { label: "Declined", value: "declined" },
                      ]}
                    />
                  </Form.Item>
                  {user.admin && (
                    <Form.Item
                      className={styles.formItem}
                      label={
                        <Text className={styles.detailsText} strong>
                          Is Training Cancelled?
                        </Text>
                      }
                    >
                      <Select
                        style={{ width: "100%" }}
                        onChange={(value) => handleCancel(value)}
                        options={[
                          { label: "Training On", value: false },
                          { label: "Cancelled", value: true },
                        ]}
                      />
                    </Form.Item>
                  )}
                </Form>
                {training && <PlayerTable game={training} />}
              </div>
            </ConfigProvider>
          </div>
        </>
      )}
    </main>
  );
}
