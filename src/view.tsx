import { Component, For, Show } from 'solid-js'
import { createEffect } from 'solid-js'
import { _Chessreplay23, Path, Move as _Move, MainChildrenAndRest as _MainChildrenAndRest, Nodes } from './ctrl'

export default function(props: { on_path: string, moves: Array<string>, on_click?: (_: Path) => void }) {

  let ctrl = new _Chessreplay23()

  createEffect(() => {
    ctrl.moves = props.moves
    })

  createEffect(() => {
      ctrl.on_path = props.on_path
      })

  const on_hover = (path: string | undefined) => {
    ctrl.a_moves.hover_path = path
  }

  const on_click = (path: string) => {
    ctrl.a_moves.on_path = path
    props.on_click?.(path)
  }

  return (<>
    <div class="chessreplay">

     <div class="moves">
       <For each={ctrl.tree}>{ (node: Nodes) =>
         <>
           <Move on_click={on_click} on_hover={on_hover} {...node}/>
           <MainChildrenAndRest on_click={on_click} on_hover={on_hover} mcr={node.main_children_and_rest}/>
         </>
       }</For>
     </div>
    </div>
      </>)
}



const MainChildrenAndRest: Component<{ mcr?: _MainChildrenAndRest, on_click: (path: string) => void,  on_hover: (_: string | undefined) => void }> = props => {
  if (!props.mcr) {
    return (<></>)
  }
  return (<>
    <Show when={props.mcr[1].length}
    fallback = {<>
      <Move on_click={props.on_click} on_hover={props.on_hover} {...props.mcr[0]}/>
      <MainChildrenAndRest on_click={props.on_click} on_hover={props.on_hover} mcr={props.mcr[0].main_children_and_rest}/>
      </>
    }>
      <div class="lines">
        <div class="line">
          <Move on_click={props.on_click} on_hover={props.on_hover} {...props.mcr[0]}/>
          <MainChildrenAndRest on_click={props.on_click} on_hover={props.on_hover} mcr={props.mcr[0].main_children_and_rest}/>
        </div>
        <For each={props.mcr[1]}>{ child =>
         <div class="line">
           <Move on_click={props.on_click} on_hover={props.on_hover} {...child}/>
           <MainChildrenAndRest on_click={props.on_click} on_hover={props.on_hover} mcr={child.main_children_and_rest}/>
         </div>
        }</For>
      </div> 
    </Show>
     </>)
}

const Move: Component<Nodes & { on_click: (path: string) => void, on_hover: (path: string | undefined) => void }> = props => {
  return (<><div class={props.klass + props.a_move.klass} 
      onClick={_ => props.on_click(props.a_move.path)}
      onMouseLeave={_ => props.on_hover(undefined)} 
      onMouseOver={_ => props.on_hover(props.a_move.path)}>
      <Show when={props.show_index}>
        <div class="index">{props.index}</div>
      </Show>
      {props.a_move.move}
      </div>
      <div class={['comment', props.a_move.klass].join(' ')}>{props.a_move.comments}</div>
      </>)
}
