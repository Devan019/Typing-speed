import { useEffect, useState, useRef } from "react";

export default function App() {
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);
  const [milisecond, setMilisecond] = useState(0);
  const [btnState, setBtnState] = useState(false);
  const btnRef = useRef(null);
  const [wpm, setWpm] = useState(0);
  const minRef = useRef(0);
  const wordC = useRef(1);
  const idx = useRef(0)
  const intervalId = useRef(null);
  const [textColor, setTextColor] = useState("text-yellow-500");
  const [Accuracy, setAccuracy] = useState(100);
  const [wrongChar, setWrongchar] = useState(0);

  // For paragraphs
  const [paratext, setparatext] = useState("");
  const [paras, setparas] = useState([]);
  const [paraNo, setParaNo] = useState(0);

  const forPara = () => {
    let p = document.querySelector(".div");
    let cluster = "";
    let splitText = p.innerText.split(" ");
    splitText.forEach((value) => {
      let split = value.split("");
      let tcluster = "";
      split.forEach((char) => {
        tcluster += `<span class='chars'>${char}</span>`;
      });
      tcluster += `<span class='chars space'>&nbsp;</span>`;
      cluster += `<div class='word'>${tcluster}</div>`;
    });
    p.innerHTML = cluster;
  };

  const handleKeyPress = (evt) => {
    let value = evt.key;
    let allChars = document.querySelectorAll(".chars");
    let char = allChars[idx.current].innerText;
    if (value.length === 1) {
      if (value === char || (value === " " && char === "\u00a0")) {
        console.log(idx.current, value, char)
        allChars[idx.current].classList.remove("text-red-500");
        allChars[idx.current].classList.add(textColor);
        idx.current++;
        wordC.current++;
        return;
      } else {
        console.log(idx.current, value, char)
        allChars[idx.current].classList.add("text-red-500");
        setWrongchar((prev) => prev + 1);
        return;
      }
    }
  };


  useEffect(() => {
    if (btnState) {
      intervalId.current = setInterval(() => {
        if (minRef.current === 1) {
          clearInterval(intervalId.current);
          setWpm(wordC.current / 5);
          setAccuracy(
            (wordC.current / document.querySelectorAll(".chars").length) * 100
          );
          setBtnState(false);
        }
        setMilisecond((prev) => {
          if (prev === 99) {
            setSecond((prevSec) => {
              if (prevSec === 59) {
                setMinute((prevMin) => prevMin + 1);
                minRef.current += 1;
                return 0;
              }
              return prevSec + 1;
            });
            return 0;
          }
          return prev + 1;
        });
      }, 10);
    } else {

      setSecond(0);
      setMinute(0);
      setMilisecond(0);
      idx.current = 0;
      minRef.current = 0;
      wordC.current = 0;
      let allChars = document.querySelectorAll(".chars");
      allChars.forEach((char) => {
        char.classList.remove(textColor, "text-red-500");
      });
      document.body.removeEventListener("keypress", handleKeyPress);
    }
  }, [btnState]);

  function forAll() {
    const keyPressHandler = (evt) => {
      let first = document.querySelectorAll(".chars");


      if (evt.key === first[0].innerHTML && !btnState) {
        setBtnState(true);
        btnRef.current = true;
      }
      if (btnRef.current) {
        handleKeyPress(evt);
      }

    };

    document.body.addEventListener("keypress", (evt) => {
      if (evt.key.length === 1) {
        setTimeout(() => {
          keyPressHandler(evt);
        }, 100)
      }
    });
  }



  useEffect(() => {
    async function main() {
      const api = await fetch("../para.json");
      const data = await api.json();
      const paras = data.paragraphs;
      setparas(paras);
      setparatext(paras[0].text);
    }
    main();
    setTimeout(() => {
      forPara();
    }, 100);

    forAll();
  }, []);

  const changePara = () => {
    setSecond(0);
    setMinute(0);
    setMilisecond(0);
    minRef.current = 0;
    btnRef.current = false;
    clearInterval(intervalId.current);

    let no = (paraNo + 1) % paras.length;
    setParaNo((prev) => prev + 1);
    setparatext(paras[no].text);
    setBtnState(false)
    setWrongchar(0)
    setTimeout(() => {
      forPara();
      forAll();
      setWrongchar(0)
    }, 100);

  }

  return (
    <div className="App bg-black text-white w-full h-screen flex flex-col items-center">
      <h2>Typing speed</h2>
      <h3 className="text-red-400">For start, press '{paratext[0]}'</h3>
      <div className="flex justify-center gap-4">
        <div>{minute}</div>
        <div>{second}</div>
        <div>{milisecond}</div>
      </div>
      <div className="p-3 flex flex-wrap div text-2xl">{paratext}</div>
      <div className="sp flex justify-around w-full">
        <button 
        type="submit"
        onClick={changePara} className="bg-green-600 p-2 rounded-lg">Change paragraph</button>
        <div>
          <div className="text-red-400">Wrong Chars: {wrongChar}</div>
          <div className="text-red-400">WPM: {wpm}</div>
          <div className="text-red-400">Accuracy: {Accuracy}%</div>
        </div>
      </div>
    </div>
  );
}
