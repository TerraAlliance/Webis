import { useRef } from "react"

import { FlowWindow } from "./FlowWindow"
import { FlowDiv } from "./FlowDiv"
import { FlowText } from "./FlowText"

export function Sidebar({ x = 0, y = 0, z = 0, width, height, buttonTexts, hue, onClick, ...props }) {
  return (
    <group position={[x, y, z]}>
      <FlowWindow width={width} height={height} childHeight={30}>
        {buttonTexts.map((element, i) => (
          <Button element={element} hue={hue} key={i} props={props} onClick={onClick} />
        ))}
      </FlowWindow>
    </group>
  )
}

function Button({ element, hue, onClick, ...props }) {
  const timeoutRef = useRef(null)
  const intervalRef = useRef(null)

  return (
    <FlowDiv
      {...props}
      hue={hue}
      onPointerDown={(e) => {
        e.stopPropagation()
        onClick(e, element)
        timeoutRef.current = setTimeout(() => (intervalRef.current = setInterval(() => onClick(e, element), 100)), 100)
      }}
      onPointerUp={() => (clearTimeout(timeoutRef.current), clearInterval(intervalRef.current))}
      onPointerLeave={() => (clearTimeout(timeoutRef.current), clearInterval(intervalRef.current))}
    >
      <FlowText text={element} fontSize={20} />
    </FlowDiv>
  )
}
