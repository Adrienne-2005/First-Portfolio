const characteristics = [
    {
        icon: 'fa-regular fa-alarm-clock',
        title: 'Punctual',
        description: 'Always manages development tasks on time, meets deadlines consistently, and maintains an organized workflow throughout every project.',
        delay: 0,
    },
    {
        icon: 'fa-regular fa-lightbulb',
        title: 'Motivation',
        description: 'Stays focused on improving coding skills, learning new technologies, and creating better user experiences through every project.',
        delay: 50,
    },
    {
        icon: 'fa-regular fa-cloud',
        title: 'Curiosity',
        description: 'Always explores new technologies, experiments with coding techniques, and seeks better ways to create engaging and user-friendly websites.',
        delay: 100,
    },
    {
        icon: 'fa-solid fa-users',
        title: 'Teamwork',
        description: 'Works well with designers and developers, shares ideas, communicates clearly, and collaborates to achieve successful project goals.',
        delay: 150,
    },
];

export function Character({ icon, title, description, delay }) {
    return (
    <div data-aos="zoom-in" data-aos-delay={delay} data-aos-duration="500">
        <div className="contents">
            <div className="bg-linear-to-b from-[#1b1a1abd] to-[#18171787] backdrop-blur-xl rounded-[clamp(0.5rem,0.1661rem+0.5212vw,1rem)] h-full flex flex-col border-[#fdfcfc47] border-[clamp(0.0625rem,0.0446rem+0.0893vw,0.1875rem)] p-[10%]">
                <i data-aos="icon-tada" data-aos-duration="1000" className={`${icon} text-[clamp(2.5rem,1.9286rem+2.8571vw,6.5rem)]`} />
                <p className="font-black pt-[5%] text-[clamp(1.4rem,1.1286rem+1.3571vw,3.3rem)]">{title}</p>
                <p className="text-[#7a7a7a] text-[clamp(0.75rem,0.6429rem+0.5357vw,1.5rem)] m-1">{description}</p>
            </div>
        </div>
    </div>
    );
}

export default function CardsSection() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[2%] auto-rows-fr">
        {characteristics.map(function(card, index) {
            return <Character key={index} {...card} />;
        })}
        </div>
    );
}