import { useEffect, useState, useRef } from 'react'

import './App.css'




function App() {
  const [second, setSecond] = useState(0);
  const [milisecond, setMiliSecond] = useState(0);
  const [minute, setminute] = useState(0);
  const [btnState, setBtnstate] = useState(false);
  const charsComplete = useRef(0);
  const [wpm, setWpm] = useState(0);
  let textColor = "text-yellow-500";
  let idx = 0;
  let stop; //for stop interval

  const secondRef = useRef(0);
  const minuteRef = useRef(0);
  const miliRef = useRef(0);

  const wpmCalculate = () => {
    console.log(minuteRef.current)
    if(minuteRef.current == 1){
      console.log("wow")
      clearInterval(stop) 
      setWpm(charsComplete.current / 5);
    }
      
  }


  const forPara = () => {
    let p = document.querySelector("p");
    let cluster = "";
    let splitText = p.innerText.split(" ");

    splitText.forEach((value, idx) => {
      let split = value.split("");
      let tcluster = "";
      split.forEach((char, idx) => {
        tcluster += `<span class='chars'>${char}</span>`
      })
      tcluster += `<span class='chars space'>&nbsp;</span>`
      cluster += `<div class = 'word'>${tcluster}</div>`

    })

    p.innerHTML = cluster
    document.body.addEventListener("keydown", (evt) => {
      setBtnstate(true)
    });
  }

  const ischeck = (e, allchars) => {
    wpmCalculate();
    if(minuteRef.current >= 1) return;
    let char = allchars[idx].innerText;
    if (e.key == char || (e.key == ' ' && char == '\u00a0')) {
      allchars[idx].classList.add(textColor);
      idx++;

      charsComplete.current += 1;
     

    }

  }

  const setAll = () => {
    if(secondRef.current == 59){
      minuteRef.current += 1;
      secondRef.current = 0;
    }

    if(miliRef.current == 99){
      secondRef.current += 1;
      miliRef.current = 0;
    }

    miliRef.current += 1;
  }

  useEffect(() => {

    if (btnState) {
      stop = setInterval(() => {
        setAll();
        setMiliSecond((prevMili) => {
          if (prevMili == 99) {
            setSecond((prevSec) => {
              if (prevSec == 59) {
                setminute((prevMinute) => {
                  if (prevMinute == 0) {
                    clearInterval(stop);
                  }
                  return prevMinute + 1;
                });
                return 0;
              }
              return prevSec + 1;
            })
            return 0;
          }
          return prevMili + 1;
        });

       

      }, 10);
    }

    return () => clearInterval(stop)
  }, [btnState])



  useEffect(() => {
    setTimeout(() => {
      forPara();
      let allchars = document.querySelectorAll(".chars");

      document.body.addEventListener("keyup", (e) => {
        // console.log(e.key)
        ischeck(e, allchars);
      })
    }, 100)

  }, [])



  return (
    <div className='bg-gray-700 w-full h-screen'>

      <h2 className='text-3xl text-yellow-400 text-center p-4'>Enter first letter of statment</h2>

      <div id='timer' className='flex justify-center items-center gap-2 text-white text-2xl'>
        <div>{minute}</div>
        <div>{second}</div>
        <div>{milisecond}</div>
      </div>

      <p className='text-center text-white text-4xl justify-center h-1/2 flex items-center flex-wrap gap-4'>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Expedita dolores in cumque velit. Sequi, quibusdam dolorum perferendis eligendi alias nisi fuga, pariatur, iste tenetur numquam ipsa. Voluptates fugit ullam sed architecto odio ab consequuntur eaque eligendi reiciendis porro tempora culpa nisi, omnis voluptate quas voluptatem aut ipsa in eum ipsum.
      </p>

      <div className='flex text-red-300 p-4 text-3xl text-center justify-center items-center m-4'>
        <div className='p-4'>Wpm :- {wpm} </div>
      </div>
    </div>
  )
}

export default App
