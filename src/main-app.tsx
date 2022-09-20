import { createSignal, createMemo } from 'solid-js'
import Chessreplay23 from './view'

const App = () => {

  let _fen = createSignal([])

  let m_fen = createMemo(() => _fen[0])

  return (<>
      <Chessreplay23 moves={m_moves()}/>
      </>)
}



export default App
