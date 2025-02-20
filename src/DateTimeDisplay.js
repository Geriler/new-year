import {useState, useEffect} from "react";
import {CircularProgressbar, buildStyles} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {motion} from "framer-motion";

const DateTimeDisplay = () => {
    const [secondsLeft, setSecondsLeft] = useState(getSecondsUntilNewYear());
    const nextYear = new Date().getFullYear() + 1;

    useEffect(() => {
        const interval = setInterval(() => {
            setSecondsLeft(getSecondsUntilNewYear());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    function getSecondsUntilNewYear() {
        const now = new Date();
        const endOfYear = new Date(now.getFullYear() + 1, 0, 1);
        return Math.floor((endOfYear - now) / 1000);
    }

    function getTimeParts(seconds) {
        return {
            days: Math.floor(seconds / (24 * 3600)),
            hours: Math.floor((seconds % (24 * 3600)) / 3600),
            minutes: Math.floor((seconds % 3600) / 60),
            seconds: seconds % 60,
        };
    }

    function getPluralLabel(value, one, few, many) {
        if (value % 10 === 1 && value % 100 !== 11) return one;
        if (value % 10 >= 2 && value % 10 <= 4 && (value % 100 < 10 || value % 100 >= 20)) return few;
        return many;
    }

    const {days, hours, minutes, seconds} = getTimeParts(secondsLeft);

    return (
        <div
            className="w-full h-full flex flex-col items-center justify-center bg-black text-white text-center p-4 min-h-screen">
            <h2 className="text-5xl md:text-6xl font-bold mb-8">До {nextYear} года осталось</h2>
            <div className="flex flex-wrap justify-center gap-6 md:gap-12 w-full max-w-4xl">
                {[{value: days, max: 365, label: getPluralLabel(days, "день", "дня", "дней")},
                    {value: hours, max: 24, label: getPluralLabel(hours, "час", "часа", "часов")},
                    {value: minutes, max: 60, label: getPluralLabel(minutes, "минута", "минуты", "минут")},
                    {value: seconds, max: 60, label: getPluralLabel(seconds, "секунда", "секунды", "секунд")}].map((unit, index) => (
                    <div key={index} className="w-32 md:w-44 flex flex-col items-center">
                        <motion.div
                            animate={{value: (unit.value / unit.max) * 100}}
                            transition={{duration: 1, ease: "easeOut", repeat: Infinity, repeatType: "mirror"}}
                        >
                            <CircularProgressbar
                                value={(unit.value / unit.max) * 100}
                                text={`${unit.value}`}
                                styles={buildStyles({textSize: "28px", pathColor: "#00FFFF", textColor: "#fff", trailColor: "#222", strokeLinecap: "round"})}
                            />
                        </motion.div>
                        <span className="text-base md:text-xl mt-4">{unit.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DateTimeDisplay;
