const skill = [
    {
        icon: 'fa-solid fa-brush',
        title: 'UI / UX Web Designer',
        description: 'User-friendly layouts, designs clean interfaces, improves digital experiences through creativity, usability, and attention to detail.',
        delay: 0,
    },
    {
        icon: 'fa-solid fa-computer',
        title: 'Front-end Developer',
        description: 'Builds responsive websites, writes clean code, creates interactive interfaces with focus on usability and performance.',
        delay: 50,
    },
    {
        icon: 'fa-solid fa-tablet-screen-button',
        title: 'Responsive Performance',
        description: 'Creates fast-loading websites, ensures smooth functionality, delivers consistent experiences across different screen devices.',
        delay: 100,
    },
    {
        icon: 'fa-solid fa-code-branch',
        title: 'Web Version Control',
        description: 'Manages code changes, tracks project updates, maintains organized development workflows through version control tools.',
        delay: 150,
    },
];

export function Skills({icon, title, description, delay}) {
    return (
        <div data-aos="zoom-in" data-aos-duration="350" data-aos-delay={delay}>
            <div className="contents">
                <div className="bg-linear-to-b from-[#1b1a1abd] to-[#18171787] backdrop-blur-xl rounded-[clamp(0.5rem,0.1661rem+0.5212vw,1rem)] h-full flex flex-col border border-[#fdfcfc47] p-[10%]">
                    <i data-aos="icon-tada" data-aos-duration="1000" className={`${icon} text-[clamp(2.5rem,1.9286rem+2.8571vw,6.5rem)]`} />
                    <p className="text-[#e6e4e4] font-black text-[clamp(1.4rem,1.1286rem+1.3571vw,3.3rem)] pt-[5%] lg:pb-5">{title}</p>
                    <p className="text-[#7a7a7a] text-[clamp(0.75rem,0.6429rem+0.5357vw,1.5rem)] m-1 grow">{description}</p>
                </div>
            </div>
        </div>
    )
}

export default function SkillCards() {
    return (
        <div className="m-[1rem_7%] grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[2%] auto-rows-fr">
        {skill.map(function(card, index) {
            return <Skills key={index} {...card} />;
        })}
        </div>
    );
}
