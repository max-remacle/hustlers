"use client";
import { useEffect, useReducer } from "react";
import {
  Button,
  ConfigProvider,
  Form,
  List,
  Select,
  Typography,
  theme,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import PlayerTable from "@/app/components/PlayerTable";
import { format } from "date-fns";
import { getDisplayName } from "../../lib/utilities/Namemap";
import { Game } from "@/app/lib/types/Game";
import styles from "./page.module.css";
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
import SpinComponent from "@/app/components/Spin";
import { useUser } from "@/app/lib/auth";
import GameModal from "@/app/components/GameModal";

const { Text } = Typography;

interface PageProps {
  params: {
    id: string;
  };
}

type State = {
  game: Game | undefined;
  isLoading: boolean;
  modalVisible: boolean;
  modalType: string;
};

type Action =
  | {
      type: "SET_GAME";
      game: Game;
      isLoading: boolean;
    }
  | { type: "SET_MODAL"; modalVisible: boolean; modalType: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_GAME":
      return {
        ...state,
        game: action.game,
        isLoading: action.isLoading,
      };
    case "SET_MODAL":
      return {
        ...state,
        modalVisible: action.modalVisible,
        modalType: action.modalType,
      };
    default:
      return state;
  }
}

const formatDate = (game: Game) => {
  if (game) {
    const date = new Date(game.date.seconds * 1000);
    const formattedDate = format(date, "MMMM do, yyyy, h:mm a");
    return formattedDate;
  }
};

export default function Page({ params }: PageProps) {
  const user = useUser();
  const [state, dispatch] = useReducer(reducer, {
    game: undefined,
    isLoading: true,
    modalVisible: false,
    modalType: "",
  });

  useEffect(() => {
    const docRef = doc(db, "games", params.id);

    const unsubscribe = onSnapshot(docRef, async (docSnap) => {
      if (docSnap.exists()) {
        const gameData = docSnap.data() as Game;
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

        gameData.confirmedPlayers = playersData;
        gameData.declinedPlayers = declinedPlayersData;

        dispatch({
          type: "SET_GAME",
          game: gameData,
          isLoading: false,
        });
      } else {
        console.log("No such document!");
      }
    });

    return () => unsubscribe();
  }, [params.id, user]);

  const handleSelectChange = async (type: string, value: string) => {
    const gameRef = doc(db, "games", params.id);
    const userRef = doc(db, "players", user.uid);

    if (type === "availability") {
      if (value === "confirmed") {
        await updateDoc(gameRef, {
          confirmedPlayers: arrayUnion(userRef),
          declinedPlayers: arrayRemove(userRef),
        });
      } else if (value === "declined") {
        await updateDoc(gameRef, {
          confirmedPlayers: arrayRemove(userRef),
          declinedPlayers: arrayUnion(userRef),
          rideRequests: arrayRemove(userRef),
          rideOffers: arrayRemove(userRef),
        });
      }
    } else if (type === "transport") {
      if (value === "rideRequest") {
        await updateDoc(gameRef, {
          rideRequests: arrayUnion(userRef),
          rideOffers: arrayRemove(userRef),
        });
      } else if (value === "rideOffer") {
        await updateDoc(gameRef, {
          rideRequests: arrayRemove(userRef),
          rideOffers: arrayUnion(userRef),
        });
      } else if (value === "neither") {
        await updateDoc(gameRef, {
          rideRequests: arrayRemove(userRef),
          rideOffers: arrayRemove(userRef),
        });
      }
    }
  };

  const closeModal = () => {
    dispatch({ type: "SET_MODAL", modalVisible: false, modalType: "" });
  };

  return (
    <main className={styles.container}>
      {state.isLoading ? (
        <SpinComponent />
      ) : (
        <>
          <div className={styles.banner}>
            {!state.game?.played && (
              <EditOutlined
                className={styles.editButton}
                onClick={() =>
                  dispatch({
                    type: "SET_MODAL",
                    modalVisible: true,
                    modalType: "Game",
                  })
                }
              />
            )}
            <div className={styles.scoreDiv}>
              {state.game?.played ? (
                <>
                  <div>
                    <Text className={styles.scoreText}>Hustlers</Text>
                  </div>
                  <div>
                    <Text className={styles.scoreText}>{`${
                      state.game!.teamScore
                    } : ${state.game!.opponentScore}`}</Text>
                  </div>
                  <div>
                    <Text className={styles.scoreText}>
                      {state.game && getDisplayName(state.game!.opponent)}
                    </Text>
                  </div>
                </>
              ) : (
                <Text className={styles.scoreText}>
                  {state.game && getDisplayName(state.game!.opponent)}
                </Text>
              )}
            </div>
            {state.game?.played ? (
              <Text className={styles.dateText}>Full-Time</Text>
            ) : (
              <>
                <Text className={styles.dateText}>
                  {formatDate(state.game!)}
                </Text>
                <Text className={styles.locationText}>{state.game!.field}</Text>
              </>
            )}
          </div>
          <div className={styles.detailsTextWrapper}>
            {state.game?.played ? (
              <>
                <div>
                  <div className={styles.detailsTitletDiv}>
                    <Text className={styles.detailsTitle}>Location</Text>
                  </div>
                  <div className={styles.detailsTextDiv}>
                    <Text className={styles.detailsText}>
                      {state.game!.field}
                    </Text>
                  </div>
                </div>
                <div>
                  <div className={styles.detailsTitletDiv}>
                    <Text className={styles.detailsTitle}>Dick of the Day</Text>
                  </div>
                  <div className={styles.detailsTextDiv}>
                    <Text className={styles.detailsText}>
                      {state.game!.dod}
                    </Text>
                  </div>
                </div>
                <div>
                  <div className={styles.detailsTitletDiv}>
                    <Text className={styles.detailsTitle}>Drink time</Text>
                  </div>
                  <div className={styles.detailsTextDiv}>
                    <Text className={styles.detailsText}>
                      {state.game!.dodTime}
                    </Text>
                  </div>
                </div>
                <div className={styles.playersDiv}>
                  <Text className={styles.detailsTitle}>Players</Text>
                  <div className={styles.listWrapper}>
                    <List
                      dataSource={state.game!.confirmedPlayers}
                      renderItem={(player, index) => (
                        <List.Item
                          key={index}
                          className={styles.listText}
                        >{`${player.firstName} ${player.lastName}`}</List.Item>
                      )}
                      grid={{ column: 3, gutter: 16 }}
                    />
                  </div>
                </div>
              </>
            ) : (
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
                        onChange={(value) =>
                          handleSelectChange("availability", value)
                        }
                        options={[
                          { label: "Confirmed", value: "confirmed" },
                          { label: "Declined", value: "declined" },
                        ]}
                      />
                    </Form.Item>
                    <Form.Item
                      className={styles.formItem}
                      label={
                        <Text className={styles.detailsText} strong>
                          Transportation
                        </Text>
                      }
                    >
                      <Select
                        style={{ width: "100%" }}
                        onChange={(value) =>
                          handleSelectChange("transport", value)
                        }
                        options={[
                          { label: "Need a Ride", value: "rideRequest" },
                          { label: "Can Offer a Ride", value: "rideOffer" },
                          { label: "Neither", value: "neither" },
                        ]}
                      />
                    </Form.Item>
                  </Form>
                  {state.game && <PlayerTable game={state.game} />}
                </div>

                {state.modalVisible && (
                  <GameModal
                    closeModal={closeModal}
                    modalType={state.modalType}
                    update={true}
                    gameId={params.id}
                  />
                )}
              </ConfigProvider>
            )}
          </div>
        </>
      )}
    </main>
  );
}
