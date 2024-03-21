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
  Timestamp,
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
import dayjs from "dayjs";

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

const currentAvailibility = (game: Game, user: any) => {
  debugger
  if (game.confirmedPlayers.includes(user.uid)) {
    return "confirmed";
  } else if (game.declinedPlayers.includes(user.uid)) {
    return "declined";
  } else {
    return "Unconfirmed";
  }
};

const currentTransport = (game: Game, user: any) => {
  if (game.rideOffers.includes(user.uid)) {
    return "rideOffer";
  } else if (game.rideRequests.includes(user.uid)) {
    return "rideRequest";
  } else {
    return "neither";
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

    if (type === "availability") {
      if (value === "confirmed") {
        await updateDoc(gameRef, {
          confirmedPlayers: arrayUnion(user.uid),
          declinedPlayers: arrayRemove(user.uid),
        });
      } else if (value === "declined") {
        await updateDoc(gameRef, {
          confirmedPlayers: arrayRemove(user.uid),
          declinedPlayers: arrayUnion(user.uid),
          rideRequests: arrayRemove(user.uid),
          rideOffers: arrayRemove(user.uid),
        });
      }
    } else if (type === "transport") {
      if (value === "rideRequest") {
        await updateDoc(gameRef, {
          rideRequests: arrayUnion(user.uid),
          rideOffers: arrayRemove(user.uid),
        });
      } else if (value === "rideOffer") {
        await updateDoc(gameRef, {
          rideRequests: arrayRemove(user.uid),
          rideOffers: arrayUnion(user.uid),
        });
      } else if (value === "neither") {
        await updateDoc(gameRef, {
          rideRequests: arrayRemove(user.uid),
          rideOffers: arrayRemove(user.uid),
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
            {!state.game?.played && user.admin && (
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
                <Text className={styles.locationText}>
                  {state.game!.cancelled ? "Cancelled" : state.game!.field}
                </Text>
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
                        size="large"
                        onChange={(value) =>
                          handleSelectChange("availability", value)
                        }
                        defaultValue={currentAvailibility(state.game!, user)}
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
                        size="large"
                        onChange={(value) =>
                          handleSelectChange("transport", value)
                        }
                        defaultValue={currentTransport(state.game!, user)}
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
                    gameCancelled={state.game!.cancelled}
                    gameId={params.id}
                    opponentProp={state.game!.opponent}
                    fieldProp={state.game!.field}
                    dateProp={dayjs(
                      new Timestamp(
                        state.game!.date.seconds,
                        state.game!.date.nanoseconds
                      ).toDate()
                    )}
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
