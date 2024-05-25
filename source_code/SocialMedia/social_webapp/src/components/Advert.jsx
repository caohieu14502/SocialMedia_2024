import { useEffect, useState } from "react";

const Advert = () => {
  const [advert, setAdvert] = useState("Hiii")
  const [count, setCount] = useState(0);


  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(prevCount => prevCount + 1);
      setAdvert(`Message updated ${count + 1} times`);
    }, 2000);

    return () => clearInterval(intervalId);
  }, [advert]); // Adding count as a dependency


  return(
    <>
    <div className="fixed right-0">{advert}</div>
    <div className="fixed left-0">{advert}</div>
    </>
  )
}

export default Advert