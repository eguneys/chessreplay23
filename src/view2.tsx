import { For, Show, createEffect, createSignal, createMemo, mapArray } from 'solid-js'

type Memo<A> = () => A

export default function(props: { moves: Array<string>, on_path: string, on_click?: (_: string) => void }) {

  const [hover_path, set_hover_path] = createSignal<string | undefined>()
  const on_hover = (_: string | undefined) => set_hover_path(_)


  const [on_path, set_on_path] = createSignal<string>('')
  const on_click = (_: string) => {
    set_on_path(_)
    props.on_click?.(_)
  }

  createEffect(() => set_on_path(props.on_path))

  return (<>
    <div class='chessreplay'>
     <div class='moves'>
     <Children path="" {...props} on_click={on_click} on_hover={on_hover} hover_path={hover_path()} on_path={on_path()}/>
     </div>
    </div>
      </>)
}

export function MoveAndChildren(props: MoveHoverProps & { move: string, moves: Array<string>, is_branch: boolean }) {
  
  let path = props.move.split(' ')[0]

  return (<>
    <Move {...props}/>
    <Children {...props} path={path}/>
</>)
}

export function Children(props: MoveHoverProps & { path: string, moves: Array<string>,  }) {

  let children: Memo<Array<string>> = () => props.moves.filter(_ => {
      let children_path = _.split(' ')[0]

      return children_path.startsWith(props.path) && children_path.length === props.path.length + 2
      })

  const is_branch = createMemo(() => children().length > 1)

  return (<>
    <Show when={is_branch()}
    fallback={
<For each={children()}>{ move =>
         <MoveAndChildren {...props} is_branch={is_branch()} move={move} />
       }</For>
       } >

    <div class='lines'>
       <For each={children()}>{ move =>
         <div class='line'>
         <MoveAndChildren {...props} is_branch={is_branch()} move={move} />
         </div>
       }</For>
    </div>
    </Show>
    </>)
}

type MoveHoverProps = { on_click: (_: string) => void, 
  on_hover: (_: string | undefined) => void,
  on_path: string, 
  hover_path: string | undefined
}

const Move = (props: MoveHoverProps & { move: string, is_branch: boolean }) => {

  let _path = props.move
    let _comments = _path.match(/([^ ]*) ([^ ]*) \{([^\}]*)\}/)
    let comments: string | undefined,
    path: string,
    move: string,
    klass: string

    if (_comments) {
      path = _comments[1]
      move = _comments[2]

      let [_, meta, __comments] = _comments[3].match(/^(__[^\_]*__)?(.*)$/)!

      comments = __comments
      klass = meta?.substring(2, meta.length - 2) || ''
    } else {
      [path, move] = _path.split(' ')
      klass = ''
    }

    let base = path.length === 2 ? '' : path.slice(0, -2)

    let ply = path.length / 2


    let i_continue = ply % 2 === 0
    let index = Math.ceil(ply / 2) + (i_continue ? '...' : '.')

    let show_index = props.is_branch || !i_continue

  let _on_path = createMemo(() => props.on_path)
  let _hover_path = createMemo(() => props.hover_path)

  let m_on_hi = createMemo(() => _on_path() === path)

  let m_on_hi_sub = createMemo(() => _on_path()?.slice(0, path.length) === path)

  let m_hi = createMemo(() => _hover_path() === path)

  let m_hi_sub = createMemo(() => _hover_path()?.slice(0, path.length) === path)

  let m_klass = createMemo(() => [
      'move',
      m_on_hi() ? 'on_hi' : '',
      m_on_hi_sub() ? 'on_hi_sub' : '',
      m_hi() ? 'hi':'',
      m_hi_sub() ? 'hi_sub': ''
  ].join(' '))




  return (<><div class={m_klass() + klass} 
      onClick={_ => props.on_click(path)}
      onMouseLeave={_ => props.on_hover(undefined)} 
      onMouseOver={_ => props.on_hover(path)}>
      <Show when={show_index}>
        <div class="index">{index}</div>
      </Show>
      {move}
      </div>
      <div class={['comment', klass].join(' ')}>{comments}</div>
      </>)
}
