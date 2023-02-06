import { createSignal, createMemo } from 'solid-js'
import Chessreplay23 from './view2'

const App = () => {

  let _fen = createSignal([])

  let m_fen = createMemo(() => _fen[0])


  let moves = [
  'd4 d4',
    'd4d5 d5',
    'd4d5f4 Bf4',
    'd4d5f4c5 c5',
    'd4d5f4c5e3 e3',
    'd4d5f4c5e3d4 cxd4',
    'd4d5f4c5e3d4d4 exd4',
    'd4d5f4c5e3b6 Qb6',
    'd4d5f4c5e3b6c3 Nc3',
    'd4d5f4c5e3b6c3e6 e6',
    'd4d5f4c5e3b6c3e6f3 Nf3',
    'd4d5f4c5e3b6c3e6f3e7 Be7 { Hello world }',
    'd4d5f4c5e3b6c3e6f3c4 c4',
    'd4d5f4c5e3b6c3e6f3e7a5 a5 { What s up ok ok ok ook }',
    'd4d5f4c5e3b6c3e6f3e7a5d8 Qd8',
    'd4d5f4c5e3b6c3e6f3c4b3 b3',
    'd4d5f4c5e3b6c3e6f3c4b3b5 b5 {__red__ redyes}',
    'd4d5f4c5e3b6c3e6f3c4b3b5b1 Rb1',
    'd4d5f4c5e3b6c3e6f3c4b3b5b1a5 Qa5',
    'd4d5f4c5e3b6c3e6f3c4b3b5b1a5b7 Rxb7',
    'd4d5f4c5e3b6c3e6f3c4b3b5b1a5b7c3 Qxc3',
    'd4d5f4c5e3b6c3e6f3c4b3b5b1a5c4 Bxc4',
    'd4d5f4c5e3b6c3e6f3c4b3b5b1a5c4c7 Qxc7',
    'd4d5f4c5e3b6c3e6f3c4b3b5b1d7 Qd7',
    'd4d5f4c5e3b6c3e6f3c4b3b5b1d7e5 Ne5',
    ]

  return (<>
      <Chessreplay23 on_path={""} moves={moves}/>
      </>)
}



export default App
