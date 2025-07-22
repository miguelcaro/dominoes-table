import { useEffect, useState } from "react";
import "./App.css";
import Textarea from "./components/textarea";

const getPlayers = (players: string) =>
  players
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p !== "");

// Cryptographically secure Fisher–Yates shuffle with fallback
function shuffleArray<T>(array: T[]): T[] {
  const a = [...array];

  // Use crypto API for better randomness quality, fallback to Math.random
  const getSecureRandom = () => {
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      return array[0] / (0xffffffff + 1); // Convert to 0-1 range
    }
    return Math.random(); // Fallback for older browsers
  };

  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(getSecureRandom() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function App() {
  const [players, setPlayers] = useState(
    "Miguel, Alcides, Alfonso, Edgard, Mc Jory, Ivan, Freddy, Pacho"
  );
  const [tables, setTables] = useState(0);

  const onGenerate = () => {
    // use Fisher–Yates
    const shuffledPlayers = shuffleArray(getPlayers(players));

    const rounds: Array<Array<[string[], string[]]>> = [];

    const table1 = shuffledPlayers.slice(0, 4);
    const table2 = shuffledPlayers.slice(4, 8);

    // Fixed rotations for first 3 rounds
    const firstThreeRounds: Array<Array<[string[], string[]]>> = [
      [
        [
          [table1[0], table1[1]],
          [table1[2], table1[3]],
        ],
        [
          [table2[0], table2[1]],
          [table2[2], table2[3]],
        ],
      ],
      [
        [
          [table1[0], table1[2]],
          [table1[3], table1[1]],
        ],
        [
          [table2[0], table2[2]],
          [table2[3], table2[1]],
        ],
      ],
      [
        [
          [table1[0], table1[3]],
          [table1[1], table1[2]],
        ],
        [
          [table2[0], table2[3]],
          [table2[1], table2[2]],
        ],
      ],
    ];
    rounds.push(...firstThreeRounds);

    // Adjusted patterns for rounds 4-7
    const remainingRounds: Array<Array<[string[], string[]]>> = [
      [
        [
          [table1[0], table2[0]],
          [table1[1], table2[2]],
        ],
        [
          [table2[1], table1[3]],
          [table1[2], table2[3]],
        ],
      ],
      [
        [
          [table1[0], table2[2]],
          [table1[1], table2[0]],
        ],
        [
          [table2[1], table1[2]],
          [table1[3], table2[3]],
        ],
      ],
      [
        [
          [table1[0], table2[1]],
          [table2[3], table1[1]],
        ],
        [
          [table1[2], table2[2]],
          [table2[0], table1[3]],
        ],
      ],
      [
        [
          [table1[0], table2[3]],
          [table1[1], table2[1]],
        ],
        [
          [table1[3], table2[2]],
          [table1[2], table2[0]],
        ],
      ],
    ];
    rounds.push(...remainingRounds);

    // Render rounds
    const tablesDisplay = rounds
      .map((round, i) => {
        const n = i + 1;
        return [
          `\n=== ROUND ${n} ===`,
          round
            .map(
              (t, idx) =>
                `Mesa ${idx + 1}: [${t[0].join(" & ")}] vs [${t[1].join(
                  " & "
                )}]`
            )
            .join("\n"),
        ].join("\n");
      })
      .join("\n");

    document.querySelector<HTMLElement>(".read-the-docs")!.textContent =
      tablesDisplay;
  };

  const autoCalculateTableNumber = () => {
    const arr = getPlayers(players);
    setTables(arr.length / 4);
  };

  useEffect(() => {
    autoCalculateTableNumber();
  }, [players]);

  return (
    <>
      <h1>La Cierra Domino</h1>
      <div className="card">
        <div>
          <label>Nombre de los jugadores separados por coma.</label>
          <div>
            <Textarea value={players} onChange={setPlayers} />
          </div>
        </div>
        <div>
          <label>Numero de mesas {tables}</label>
        </div>
        <button
          onClick={onGenerate}
          disabled={getPlayers(players).length !== 8}
        >
          Generar
        </button>
      </div>
      <pre className="read-the-docs"></pre>
    </>
  );
}

export default App;
