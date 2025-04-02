import { useEffect, useState } from 'react'
import './App.css'
import Textarea from './components/textarea';

const getPlayers = (players: string) => players.split(',').map(p => p.trim()).filter(p => p !== '');

function App() {
  const [players, setPlayers] = useState('Miguel, Alcides, Alfonso, Edgard, Mc Jory, Daniel, Hector, Pacho');
  const [tables, setTables] = useState(0);

  const onGenerate = () => {
    const shuffledPlayers = getPlayers(players).sort(() => Math.random() - 0.5);

    const rounds: Array<Array<[string[], string[]]>> = [];

    const table1 = shuffledPlayers.slice(0, 4);
    const table2 = shuffledPlayers.slice(4, 8);

    // Fixed rotations for first 3 rounds
    const firstThreeRounds: Array<Array<[string[], string[]]>> = [
      [
        [[table1[0], table1[1]], [table1[2], table1[3]]],
        [[table2[0], table2[1]], [table2[2], table2[3]]]
      ],
      [
        [[table1[0], table1[2]], [table1[3], table1[1]]],
        [[table2[0], table2[2]], [table2[3], table2[1]]]
      ],
      [
        [[table1[0], table1[3]], [table1[1], table1[2]]],
        [[table2[0], table2[3]], [table2[1], table2[2]]]
      ]
    ];
    rounds.push(...firstThreeRounds);

    // Adjusted patterns for rounds 4-7
    const remainingRounds: Array<Array<[string[], string[]]>> = [
      [
        [[table1[0], table2[0]], [table1[1], table2[2]]],
        [[table2[1], table1[3]], [table1[2], table2[3]]]
      ],
      [
        [[table1[0], table2[2]], [table1[1], table2[0]]],
        [[table2[1], table1[2]], [table1[3], table2[3]]]
      ],
      [
        [[table1[0], table2[1]], [table2[3], table1[1]]],
        [[table1[2], table2[2]], [table2[0], table1[3]]]
      ],
      [
        [[table1[0], table2[3]], [table1[1], table2[1]]],
        [[table1[3], table2[2]], [table1[2], table2[0]]]
      ]
    ];
    rounds.push(...remainingRounds);

    // Display all rounds
    const tablesDisplay = rounds
      .map((round, roundIndex) => {
        const roundNumber = roundIndex + 1;
        return [
          `\n=== ROUND ${roundNumber} ===`,
          round.map((table, tableIndex) => 
            `Mesa ${tableIndex + 1}: [${table[0].join(' & ')}] vs [${table[1]?.join(' & ') || 'Waiting...'}]`
          ).join('\n')
        ].join('\n');
      })
      .join('\n');
      
    document.querySelector('.read-the-docs')!.textContent = tablesDisplay;
  }

  const autoCalculateTableNumber = () => {
    const arrPlayers = getPlayers(players);
    const newTables = arrPlayers.length / 4;
    setTables(newTables);
  };

  useEffect(() => {
    autoCalculateTableNumber();
  }, [players])

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
      <pre className="read-the-docs">
        
      </pre>
    </>
  )
}

export default App
