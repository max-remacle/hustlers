"use client";
import SpinComponent from "@/app/components/Spin";
import React, { useState, useEffect } from "react";
import {
  Button,
  ConfigProvider,
  Form,
  Select,
  Switch,
  Typography,
  theme,
} from "antd";
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
import { tr } from "date-fns/locale/tr";

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

const currentAvailibility = (training: Training, user: any) => {
  if (training.confirmedPlayers.includes(user.uid)) {
    return "confirmed";
  } else if (
    training.declinedPlayers.includes(user.uid)
  ) {
    return "declined";
  } else {
    return "Unconfirmed";
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

    if (value === "confirmed") {
      await updateDoc(trainingRef, {
        confirmedPlayers: arrayUnion(user.uid),
        declinedPlayers: arrayRemove(user.uid),
      });
    } else if (value === "declined") {
      await updateDoc(trainingRef, {
        confirmedPlayers: arrayRemove(user.uid),
        declinedPlayers: arrayUnion(user.uid),
      });
    }
  };

  const handleCancel = async () => {
    try {
      const trainingRef = doc(db, "trainings", params.id);
      const trainingUpdate = {
        cancelled: !training!.cancelled,
      };
      await updateDoc(trainingRef, trainingUpdate);
    } catch (err: any) {
      console.error("Error updating document: ", err);
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
                      size="large"
                      defaultValue={currentAvailibility(training!, user)}
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
                          Cancel Training
                        </Text>
                      }
                    >
                      <Button
                        style={{ width: "100%" }}
                        size="large"
                        ghost={training!.cancelled}
                        type="primary"
                        danger
                        onClick={handleCancel}
                      >
                        {training?.cancelled ? "Un-Cancel" : "Cancel"}
                      </Button>
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
