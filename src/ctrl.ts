import { Signal } from 'solid-js'
import { untrack, createEffect, createSignal, createMemo, mapArray } from 'solid-js'
import { Memo, read, write, owrite } from 'solid-play'


export type Path = string

export type MainChildrenAndRest = [Nodes, Array<Nodes>]
export type Nodes = {
  hi: boolean,
  a_move: Move,
  index: string,
  show_index: boolean,
  main_children_and_rest?: MainChildrenAndRest
}


export class _Chessreplay23 {

  get tree() {
    return this.a_moves.tree
  }

  set moves(moves: Array<string>) {
    this.a_moves.moves = moves
  }


  a_moves: Moves

  constructor(on_hover: (_: Path) => void) {

    this.a_moves = Moves.make(this)

    createEffect(() => {
      const path = read(this.a_moves._hover_path)
      if (path) {
        untrack(() => on_hover(path))
      }
    })

  }
}

export type Replay = _Chessreplay23

function node_hi(node: Nodes, path: string) {

  if (path.slice(0, node.a_move.path.length) === node.a_move.path) {
    node.hi = true
  }
  if (node.main_children_and_rest) {
    node_hi(node.main_children_and_rest[0], path)
    node.main_children_and_rest[1].forEach(_ => node_hi(_, path))
  }
}

function node_off(node: Nodes) {
  node.hi = false
  if (node.main_children_and_rest) {
    node_off(node.main_children_and_rest[0])
    node.main_children_and_rest[1].forEach(_ => node_off(_))
  }
}


export class Moves {

  static make = (replay: Replay) => new Moves(replay)

  hover_path(path: string) {
    this.m_tree().forEach(_ => node_off(_))
    this.m_tree().forEach(_ => node_hi(_, path))

    owrite(this._hover_path, _ => path)
  }

  hover_off() {
    this.m_tree().forEach(_ => node_off(_))
  }
  get tree() {
    return this.m_tree()
  }
  set moves(moves: Array<string>) {
    owrite(this._moves, moves)
  }


  m_tree: Memo<Array<Nodes>>
  _moves: Signal<Array<string>>
  _hover_path: Signal<string | undefined>


  constructor(readonly replay: Replay) {
  
    let _hover_path: Signal<string | undefined> = createSignal(undefined, { equals: false })
    this._hover_path = _hover_path

    let _moves: Signal<Array<string>> = createSignal([])
    this._moves = _moves

    let a_moves: Memo<Array<Move>> = createMemo(mapArray(_moves[0], Move.make))

    function make_nodes(path: string): Memo<Array<Nodes>> {
      return createMemo(() =>  {
        let children = a_moves().filter(_ => _.base === path)

        let is_branch = children.length > 1

        return children.map(a_move => {
          let m_cs = make_nodes(a_move.path)

          let cs = m_cs()
          let main_children_and_rest: MainChildrenAndRest | undefined
          if (cs.length > 0) {
            main_children_and_rest = [
              cs[0],
              cs.slice(1)
            ]
          }

          let i_continue = a_move.ply % 2 === 0
          let index = Math.ceil(a_move.ply / 2) + (i_continue ? '...' : '.')

          let show_index = is_branch || !i_continue

          let _hi = createSignal(false)

          return {
            set hi(v: boolean) {
              owrite(_hi, v)
            },
            get hi() {
              return read(_hi)
            },
            a_move,
            index,
            show_index,
            main_children_and_rest
          }
        })
      })
    }

    let m_tree: Memo<Array<Nodes>> = make_nodes('')
    this.m_tree = m_tree

    function node_hi(node: Nodes, path: string) {

      if (path.slice(0, node.a_move.path.length) === node.a_move.path) {
        node.hi = true
      }
      if (node.main_children_and_rest) {
        node_hi(node.main_children_and_rest[0], path)
        node.main_children_and_rest[1].forEach(_ => node_hi(_, path))
      }
    }

    function node_off(node: Nodes) {
      node.hi = false
      if (node.main_children_and_rest) {
        node_off(node.main_children_and_rest[0])
        node.main_children_and_rest[1].forEach(_ => node_off(_))
      }
    }

  }

}



export class Move {

  static make = (_path: string) => new Move(_path)

  ply: number
  path: string
  base: string
  move: string
  comments: string | undefined

  constructor(_path: string) {
    let _comments = _path.match(/([^ ]*) ([^ ]*) \{([^\}]*)\}/)
    let comments,
    path,
    move
    if (_comments) {
      path = _comments[1]
      move = _comments[2]
      comments = _comments[3]
    } else {
      [path, move] = _path.split(' ')
    }

    let base = path.length === 2 ? '' : path.slice(0, -2)

    let ply = path.length / 2

    this.path = path
    this.ply = ply
    this.base = base
    this.move = move
    this.comments = comments
  }
}
