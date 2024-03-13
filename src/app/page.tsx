"use client";
import { useEffect, useReducer } from "react";
import GameDetails from "./components/GameDetails";
import styles from "./page.module.css";
import { db } from "./lib/Firebase";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { PlusCircleOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import TrainingDetails from "./components/TrainingDetails";
import { useUser } from "./lib/auth";
import Auth from "./components/Auth";
import dynamic from "next/dynamic";
import { Game } from "./lib/types/Game";
import { Training } from "./lib/types/Training";
import { useGameStore } from "./store/game";
import { Timestamp } from "firebase/firestore";
import SpinComponent from "./components/Spin";
import GameModal from "./components/GameModal";
import { Dancing_Script } from "next/font/google";

const DynamicModal = dynamic(() => import("antd").then((mod) => mod.Modal), {
  ssr: false,
});

type State = {
  training: Training | undefined;
  nextGame: Game | undefined;
  modalVisible: boolean;
  modalType: string;
};

type Action =
  | { type: "SET_TRAINING"; training: Training }
  | { type: "SET_NEXT_GAME"; game?: Game }
  | { type: "SET_MODAL"; modalVisible: boolean; modalType: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_TRAINING":
      return { ...state, training: action.training };
    case "SET_NEXT_GAME":
      return { ...state, nextGame: action.game };
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

function getNextGame(games: Game[]): Game | undefined {
  const sortedGames = [...games];
  const now = new Date();
  const nextGame = sortedGames.find(
    (game) =>
      new Timestamp(game.date.seconds, game.date.nanoseconds).toDate() > now &&
      game.played === false
  );
  return nextGame;
}

const dancing = Dancing_Script({ subsets: ["latin"] });

export default function Home() {
  const user = useUser();
  const [state, dispatch] = useReducer(reducer, {
    training: undefined,
    nextGame: undefined,
    modalVisible: false,
    modalType: "",
  });

  const updateGames = useGameStore((state: any) => state.updateGames);

  useEffect(() => {
    if (!user) return;
    const gameQuery = query(collection(db, "games"), orderBy("date", "asc"));
    const trainingQuery = query(
      collection(db, "trainings"),
      orderBy("date", "desc"),
      limit(1)
    );

    const unsubscribeGame = onSnapshot(gameQuery, (snapshot) => {
      const games = snapshot.docs.map((doc) => {
        const game = doc.data();
        game.id = doc.id;
        return game as Game;
      });
      updateGames(games);
      dispatch({ type: "SET_NEXT_GAME", game: getNextGame(games) });
    });

    const unsubscribeTraining = onSnapshot(trainingQuery, (snapshot) => {
      const latestTraining = snapshot.docs[0]?.data();
      dispatch({ type: "SET_TRAINING", training: latestTraining as Training });
    });

    return () => {
      unsubscribeGame();
      unsubscribeTraining();
    };
  }, [user, updateGames]);

  const modalStyles = {
    mask: {
      backdropFilter: "blur(20px)",
    },
    content: {
      backgroundColor: "#181818",
    },
  };

  const closeModal = () => {
    dispatch({ type: "SET_MODAL", modalVisible: false, modalType: "" });
  };

  if (user) {
    return (
      <main className={styles.container}>
        {state.modalVisible && (
          <GameModal
            closeModal={closeModal}
            modalType={state.modalType}
            update={false}
          />
        )}
        <div className={styles.cardContainer}>
          <div className={styles.titleContainer}>
            <Title className={styles.title} level={2}>
              Upcoming Game
            </Title>
            {user.admin && (
              <PlusCircleOutlined
                onClick={() =>
                  dispatch({
                    type: "SET_MODAL",
                    modalVisible: true,
                    modalType: "Game",
                  })
                }
                className={styles.icon}
              />
            )}
          </div>
          {state.nextGame && <GameDetails game={state.nextGame} />}
        </div>
        <div className={styles.cardContainer}>
          <div className={styles.titleContainer}>
            <Title className={styles.title} level={2}>
              Upcoming Training
            </Title>
            {user.admin && (
              <PlusCircleOutlined
                onClick={() =>
                  dispatch({
                    type: "SET_MODAL",
                    modalVisible: true,
                    modalType: "Training",
                  })
                }
                className={styles.icon}
              />
            )}
          </div>
          {state.training && <TrainingDetails training={state.training} />}
        </div>
        <Title
          className={dancing.className}
          style={{ color: "white", fontSize: "36px", marginTop: "16px" }}
          level={2}
        >
          FUCK MARIST
        </Title>
      </main>
    );
  }

  if (user === false) {
    return <SpinComponent />;
  }

  return (
    <main className={styles.container}>
      <DynamicModal
        className={styles.modal}
        destroyOnClose
        maskClosable={false}
        styles={modalStyles}
        open={true}
        closeIcon={false}
        closable={false}
        footer={null}
      >
        <Auth />
      </DynamicModal>
    </main>
  );
}
