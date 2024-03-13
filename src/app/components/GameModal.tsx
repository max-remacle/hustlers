import React, { useState } from "react";
import { Modal, Button, Input, Form, DatePicker } from "antd";
import { Dayjs } from "dayjs";

import styles from "./GameModal.module.css";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/Firebase";

type GameModalProps = {
  modalType: string;
  closeModal: () => void;
  update?: boolean;
  gameId?: string;
};

const GameModal: React.FC<GameModalProps> = ({
  modalType,
  closeModal,
  update,
  gameId,
}) => {
  const [opponent, setOpponent] = useState<string>("");
  const [field, setField] = useState<string>("");
  const [date, setDate] = useState<Dayjs | null>(null);
  const [teamScore, setTeamScore] = useState<number>(0);
  const [opponentScore, setOpponentScore] = useState<number>(0);
  const [dod, setDod] = useState<string>("");
  const [dodTime, setDodTime] = useState<string>("");

  const modalStyles = {
    mask: {
      backdropFilter: "blur(20px)",
    },
    content: {
      backgroundColor: "#181818",
      width: "75%",
    },
  };

  const handleSubmit = async () => {
    try {
      if (modalType === "Training") {
        const trainingRef = collection(db, "trainings");
        const newTraining = {
          field,
          date: date!.toDate(),
          confirmedPlayers: [],
          cancelled: false,
        };
        await addDoc(trainingRef, newTraining);
        closeModal();
      } else {
        if (!update) {
          const gameRef = collection(db, "games");
          const newGame = {
            opponent,
            field,
            date: date!.toDate(),
            confirmedPlayers: [],
            declinedPlayers: [],
            rideOffers: [],
            rideRequests: [],
            played: false,
          };
          await addDoc(gameRef, newGame);
          closeModal();
        } else {
          const gameRef = doc(db, "games", gameId!);
          await updateDoc(gameRef, {
            teamScore,
            opponentScore,
            dod,
            dodTime,
            played: true,
          });
        }
      }
    } catch (err: any) {
      console.error("Error adding document: ", err);
    }
  };

  return (
    <>
      <Modal
        className={styles.modal}
        closeIcon={false}
        footer={null}
        styles={modalStyles}
        open={true}
        onCancel={closeModal}
        title={
          <Title level={3} className={styles.modalTitle}>
            {update ? `Update ${modalType}` : `Add ${modalType}`}
          </Title>
        }
      >
        {update ? (
          <Form onFinish={handleSubmit} layout="vertical">
            <div style={{ display: "flex" }}>
              <Form.Item
                name="teamScore"
                label={
                  <Text className={styles.modalText} strong>
                    Team Score
                  </Text>
                }
                rules={[
                  { required: true, message: "Please Enter a Team Score" },
                ]}
                validateTrigger="onBlur"
              >
                <Input
                  style={{ width: "95%" }}
                  size="large"
                  placeholder="Add team score"
                  type="number"
                  onChange={(e) => setTeamScore(Number(e.target.value))}
                />
              </Form.Item>
              <Form.Item
                label={
                  <Text className={styles.modalText} strong>
                    Opponent Score
                  </Text>
                }
                name="opponentScore"
                rules={[
                  {
                    required: true,
                    message: "Please Enter an Opponent Score",
                  },
                ]}
                validateTrigger="onBlur"
              >
                <Input
                  style={{ width: "95%" }}
                  size="large"
                  type="number"
                  placeholder="Add opponent score"
                  onChange={(e) => setOpponentScore(Number(e.target.value))}
                />
              </Form.Item>
            </div>
            <Form.Item
              label={
                <Text className={styles.modalText} strong>
                  Dick of the Day
                </Text>
              }
              name="dod"
              rules={[
                { required: true, message: "Please Enter a Dick of the Day" },
              ]}
              validateTrigger="onBlur"
            >
              <Input
                size="large"
                placeholder="Add Dick of the Day"
                onChange={(e) => setDod(e.target.value.trim())}
              />
            </Form.Item>
            <Form.Item
              label={
                <Text className={styles.modalText} strong>
                  Dick of the Day Time
                </Text>
              }
              name="dodTime"
              rules={[
                {
                  required: true,
                  message: "Please Enter a Dick of the Day Time",
                },
              ]}
              validateTrigger="onBlur"
            >
              <Input
                size="large"
                placeholder="Add Dick of the Day Time"
                onChange={(e) => setDodTime(e.target.value.trim())}
              />
            </Form.Item>
            <Form.Item>
              <Button
                style={{ width: "100%" }}
                size="large"
                type="primary"
                htmlType="submit"
              >
                {update ? "Update" : "Add"}
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <Form onFinish={handleSubmit} layout="vertical">
            {modalType === "Game" && (
              <>
                <Form.Item
                  name="opponent"
                  label={
                    <Text className={styles.modalText} strong>
                      Opponent
                    </Text>
                  }
                  rules={[
                    { required: true, message: "Please Enter an Opponent" },
                  ]}
                  validateTrigger="onBlur"
                >
                  <Input
                    size="large"
                    placeholder="Add Opponent"
                    onChange={(e) => setOpponent(e.target.value.trim())}
                  />
                </Form.Item>
              </>
            )}
            <Form.Item
              label={
                <Text className={styles.modalText} strong>
                  Field
                </Text>
              }
              name="field"
              rules={[{ required: true, message: "Please Enter a Field" }]}
              validateTrigger="onBlur"
            >
              <Input
                size="large"
                placeholder="Add Field"
                onChange={(e) => setField(e.target.value.trim())}
              />
            </Form.Item>
            <Form.Item
              label={
                <Text className={styles.modalText} strong>
                  Date
                </Text>
              }
              name="date"
              rules={[{ required: true, message: "Please Enter a Date" }]}
              validateTrigger="onBlur"
            >
              <DatePicker
                use12Hours
                size="large"
                showTime={{ format: "HH:mm" }}
                onChange={(e) => setDate(e)}
                value={date}
              />
            </Form.Item>
            <Form.Item>
              <Button
                style={{ width: "100%" }}
                size="large"
                type="primary"
                htmlType="submit"
              >
                {update ? "Update" : "Add"}
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default GameModal;
