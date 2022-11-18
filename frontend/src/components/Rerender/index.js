import React, { useEffect, useState } from "react";

function Rerender() {
  const [render, setRender] = useState(true);

  return (
    setRender(!render)
  )
}

export default Rerender;
