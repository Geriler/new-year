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
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-black text-white text-center">
            <h1 className="text-4xl font-bold mb-6">До {nextYear} года осталось</h1>
            <div className="flex justify-center gap-12">
                {[{value: days, max: 365, label: getPluralLabel(days, "день", "дня", "дней")},
                    {value: hours, max: 24, label: getPluralLabel(hours, "час", "часа", "часов")},
                    {value: minutes, max: 60, label: getPluralLabel(minutes, "минута", "минуты", "минут")},
                    {
                        value: seconds,
                        max: 60,
                        label: getPluralLabel(seconds, "секунда", "секунды", "секунд")
                    }].map((unit, index) => (
                    <div key={index} className="w-40 flex flex-col items-center">
                        <motion.div
                            animate={{value: (unit.value / unit.max) * 100}}
                            transition={{duration: 1, ease: "easeOut", repeat: Infinity, repeatType: "mirror"}}
                        >
                            <CircularProgressbar
                                value={(unit.value / unit.max) * 100}
                                text={`${unit.value}`}
                                styles={buildStyles({
                                    textSize: "24px",
                                    pathColor: "#00FFFF",
                                    textColor: "#fff",
                                    trailColor: "#222",
                                    strokeLinecap: "round"
                                })}
                            />
                        </motion.div>
                        <span className="text-lg mt-4">{unit.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DateTimeDisplay;
