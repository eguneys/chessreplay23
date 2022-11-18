import { Signal } from 'solid-js'
import { on, untrack, createEffect, createSignal, createMemo, mapArray } from 'solid-js'
import { Memo, read, write, owrite } from 'solid-play'


export type Path = string

export type MainChildrenAndRest = [Nodes, Array<Nodes>]
export type Nodes = {
  klass: string,
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

  set on_path(_: string | undefined) {

    this.a_moves.on_path = _
  }


  a_moves: Moves

  constructor() {
    this.a_moves = Moves.make(this)
  }
}

export type Replay = _Chessreplay23

export class Moves {

  static make = (replay: Replay) => new Moves(replay)

  set on_path(path: string | undefined) {
    owrite(this._on_path, path)
  }

  set hover_path(path: string | undefined) {
    owrite(this._hover_path, _ => path)
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
  _on_path: Signal<string | undefined>


  constructor(readonly replay: Replay) {
  
    let _hover_path: Signal<string | undefined> = createSignal(undefined, { equals: false })
    this._hover_path = _hover_path

    let _on_path: Signal<string | undefined> = createSignal(undefined, { equals: false })
    this._on_path = _on_path

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


          let m_on_hi = createMemo(() =>
            read(_on_path) === a_move.path
          )

          let m_on_hi_sub = createMemo(() => 
                                    read(_on_path)?.slice(0, a_move.path.length) === a_move.path)



          let m_hi = createMemo(() =>
            read(_hover_path) === a_move.path
          )

          let m_hi_sub = createMemo(() => 
                                    read(_hover_path)?.slice(0, a_move.path.length) === a_move.path)

          let m_klass = createMemo(() => [
            'move',
            m_on_hi() ? 'on_hi' : '',
            m_on_hi_sub() ? 'on_hi_sub' : '',
            m_hi() ? 'hi':'',
            m_hi_sub() ? 'hi_sub': ''
          ].join(' '))

          return {
            get klass() {
              return m_klass()
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
  }

}



export class Move {

  static make = (_path: string) => new Move(_path)

  ply: number
  path: string
  base: string
  move: string
  comments: string | undefined
  klass: string

  constructor(_path: string) {
    let _comments = _path.match(/([^ ]*) ([^ ]*) \{([^\}]*)\}/)
    let comments,
    path,
    move,
    klass

    if (_comments) {
      path = _comments[1]
      move = _comments[2]

      let [_, meta, __comments] = _comments[3].match(/^(__[^\_]*__)?(.*)$/)!

      comments = __comments
      klass = meta?.substring(2, meta.length - 2) || ''
      console.log(meta, __comments)
    } else {
      [path, move] = _path.split(' ')
      klass = ''
    }

    let base = path.length === 2 ? '' : path.slice(0, -2)

    let ply = path.length / 2

    this.path = path
    this.ply = ply
    this.base = base
    this.move = move
    this.comments = comments
    this.klass = klass
  }
}
