import Head from 'next/head'
import { useEffect, useState } from 'react'
import clientPromise from '../lib/mongodb';
import ClickZone from 'components/clickzone.js';
import Timer from 'components/timer.js';
import DisplayCPS from 'components/displaycps.js';
import Ranking from 'components/ranking.js';
import Prompt from 'components/prompt.js';

export async function getServerSideProps(context) {
  try {
    await clientPromise
    return {
      props: { isConnected: true },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
}

export default function Home({ isConnected }) {
  let [timerZero, setTimerZero] = useState(false);
  let [firstClick, setFirstClick] = useState(false);
  let [nbClicks, setNbClicks] = useState(null);
  let [refresh, setRefresh] = useState(false);
  let [pseudo, setPseudo] = useState(null);
  let [highscores, setHighscores] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      (async () => {
        setHighscores(null);
        const results = await fetch("/api/list");
        const resultsJson = await results.json();
        setHighscores(resultsJson);
      })();
    }, 1500)
  }, [pseudo])

  useEffect(() => {
    if (refresh) {
      setTimerZero(false);
      setNbClicks(0);
      setFirstClick(false);
      setRefresh(false);
    } else {
      return;
    }
  }, [refresh])

  return (
    <main>
      <h1 id="main-title">CLICKTEST</h1>
      <section id="main-container">
        <ClickZone setFirstClick={setFirstClick} timerZero={timerZero} setNbClicks={setNbClicks}/>
        <Timer firstClick={firstClick} refresh={refresh} setTimerZero={setTimerZero}/>
        <DisplayCPS clicks={nbClicks} setRefresh={setRefresh}/>
        <Prompt setPseudo={setPseudo} timerZero={timerZero}/>
      </section>
      <div className="ranking-container">
        <Ranking name={pseudo} clicks={nbClicks} highscores={highscores}/>
      </div>
    </main>
  )
}