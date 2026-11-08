import { useEffect } from 'react'
import 'aos/dist/aos.css';
import AOS from 'aos';

function findByAttr(root, tag, attr) {
  var list = root.getElementsByTagName(tag);
  var result = [];
  for (var i = 0; i < list.length; i++) {
    if (list[i].hasAttribute(attr)) result.push(list[i]);
  }
  return result;
}

function initGallery(gallery, signal) {
  var track = findByAttr(gallery, 'div', 'data-track')[0];
  var thumbsBox = findByAttr(gallery, 'div', 'data-thumbs')[0];
  var thumbs = findByAttr(gallery, 'a', 'data-thumb');
  var counter = findByAttr(gallery, 'p', 'data-counter')[0];
  var prevBtn = findByAttr(gallery, 'button', 'data-prev')[0];
  var nextBtn = findByAttr(gallery, 'button', 'data-next')[0];
  var total = track.children.length;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var current = 0;
  var ticking = false;

  function behavior() { return reduce.matches ? 'auto' : 'smooth'; }

  function render(i) {
    current = i;
    for (var n = 0; n < thumbs.length; n++) {
      thumbs[n].setAttribute('aria-current', n === i ? 'true' : 'false');
    }
    if (counter) counter.textContent = (i + 1) + ' / ' + total;

    var t = thumbs[i];
    if (t && thumbsBox) {
      var tr = t.getBoundingClientRect();
      var br = thumbsBox.getBoundingClientRect();
      thumbsBox.scrollBy({
        left: tr.left - br.left - (br.width - tr.width) / 2,
        behavior: behavior()
      });
    }
  }

  function go(i) {
    i = (i + total) % total;
    track.scrollTo({ left: i * track.clientWidth, behavior: behavior() });
    render(i);
  }

  function onTrackScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var i = Math.round(track.scrollLeft / track.clientWidth);
      if (i !== current && i >= 0 && i < total) render(i);
    });
  }

  function onThumbClick(index) {
    return function (e) { e.preventDefault(); go(index); };
  }

  var opts = { signal: signal };

  track.addEventListener('scroll', onTrackScroll, { passive: true, signal: signal });
  prevBtn.addEventListener('click', function () { go(current - 1); }, opts);
  nextBtn.addEventListener('click', function () { go(current + 1); }, opts);

  for (var k = 0; k < thumbs.length; k++) {
    thumbs[k].addEventListener('click', onThumbClick(k), opts);
  }

  track.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); go(current - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(current + 1); }
  }, opts);

  window.addEventListener('resize', function () {
    track.scrollTo({ left: current * track.clientWidth, behavior: 'auto' });
  }, opts);

  render(0);
}

function App() {
  useEffect(function () {
    AOS.init({ duration: 500, once: false });
    AOS.refresh();

    var controller = new AbortController();
    var projects = document.getElementById('projects') || document;
    var galleries = findByAttr(projects, 'div', 'data-gallery');
    for (var g = 0; g < galleries.length; g++) {
      initGallery(galleries[g], controller.signal);
    }

    return function () { controller.abort(); }; // removes all listeners
  }, []);

  return (

    <>
      <div>
        <header className="font-black">
          <div className="navbar fixed inset-x-0 z-50 min-h-auto bg-linear-to-b from-[#1a1a1a82] to-[#0f0f0f70] backdrop-blur-md border-b-[clamp(0.0625rem,0.0446rem+0.0893vw,0.1875rem)] border-[#fdfcfc47] text-[clamp(0.875rem,0.6286rem+1.2321vw,2.6rem)] p-[1.25%_3.5%]">
            <div className="navbar-start min-w-0 flex-1">
              <a href="#home" className=" pl-2.5">
                Xyrill Adrienne Combes
              </a>
            </div>
            <div className="navbar-end w-auto md:hidden">
              <div className="dropdown dropdown-end">
                <button
                  aria-label="Menu"
                  className="btn btn-ghost btn-sm transition-all duration-300 hover:bg-[#ffffff1f] focus:bg-[#ffffff1f]"
                >
                  <i className="fa-solid fa-bars" />
                </button>
                <ul className="menu dropdown-content mt-5 backdrop-blur-2xl w-[clamp(8.75rem,5.7143rem+15.1786vw,13rem)] rounded-box z-50 border bg-linear-to-b from-[#181818d9] to-[#111111d8] border-[#fdfcfc47] text-[clamp(0.875rem,0.6071rem+1.3393vw,1.25rem)]">
                  <div className="p-[5%]">
                    <li>
                      <a
                        href="#home"
                        className="hover:bg-[#ffffff1f] active:bg-primary"
                      >
                        Home
                      </a>
                    </li>
                    <li>
                      <a
                        href="#about"
                        className="hover:bg-[#ffffff1f] active:bg-primary"
                      >
                        About
                      </a>
                    </li>
                    <li>
                      <a
                        href="#projects"
                        className="hover:bg-[#ffffff1f] active:bg-primary"
                      >
                        Projects
                      </a>
                    </li>
                    <li>
                      <a
                        href="#contacts"
                        className="hover:bg-[#ffffff1f] active:bg-primary"
                      >
                        Contacts
                      </a>
                    </li>
                  </div>
                </ul>
              </div>
            </div>
            <div className="hidden md:grid grid-cols-4 gap-[clamp(1.25rem,-2.5rem+7.8125vw,10rem)]">
              <a href="#home">Home</a>
              <a href="#about">About</a>
              <a href="#projects">Projects</a>
              <a href="#contacts">Contacts</a>
            </div>
          </div>
        </header>
        <main>
          <section className="" id="home">
            <div className="pt-24 lg:hidden text-center">
              <div className="grid grid-cols-1 sm:grid-cols-2" />
              <div className="firsthalf">
                <div className="p-[5%] flex justify-center items-center">
                  <i className="fa-regular fa-circle-user text-[clamp(10rem,2.8412rem+35.7942vw,20rem)]" />
                </div>
              </div>
              <div className="">
                <div className=" p-[1rem_5%_8.5%_5%]">
                  <p className="font-black text-[clamp(1.25rem,0.8571rem+1.9643vw,4rem)] text-[#B7B7B7]">
                    Xyrill Adrienne Combes
                  </p>
                  <div className="text-[clamp(1.8125rem,0.8729rem+4.698vw,3.125rem)] font-black -space-y-2">
                    <p className="pt-1">Front-end Developer</p>
                    <p className="">and Designer</p>
                  </div>
                  <p className="text-[clamp(0.6875rem,0.4643rem+1.1161vw,2.25rem)] text-[#A2A1A1] p-[0.55rem_5%_0%_5%]">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Voluptas exercitationem voluptatum molestias nesciunt
                    praesentium officiis. Sed reiciendis sint vitae eos.
                  </p>
                </div>
                <div className="">
                  <div className="transition delay-150 duration-300 ease-in-out">
                    <button className="button rounded-lg backdrop-blur-[3px] border-[clamp(0.0625rem,0.0446rem+0.0893vw,0.1875rem)] border-[#fdfcfc47] bg-linear-to-b from-[#1d1d1d] to-[#141414] p-[clamp(0.55rem,0.371rem+0.8949vw,0.8rem)] cursor-pointer">
                      <div className="flex">
                        <p className="font-black text-[clamp(0.875rem,0.5618rem+1.566vw,1.3125rem)] ml-1">
                          Download CV
                        </p>
                        <i className="fa-regular fa-file ml-2 mt-1 text-[clamp(0.875rem,0.5618rem+1.566vw,1.3125rem)]" />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
      <div className="hidden lg:block">
        <div className="relative">
          {/* <div class="absolute -z-20">
                              <img class="w-screen object-fit object-cover h-240 opacity-50 mask-b-to-transparent mask-b-from-20%" src="" alt="profile-banner">
                          </div> */}
          {/* <div class="absolute inset-0 -z-10 bg-linear-to-r from-transparent via-[#111111ab] to-[#111111e3] pointer-events-none h-auto"></div> */}
          <div className="grid grid-cols-2 relative pt-[25vh] pr-[5%] ">
            <div className="flex justify-center items-center">
              <i className="fa-regular fa-circle-user text-[clamp(20rem,-3.3333rem+36.4583vw,55rem)]" />
            </div>
            <div className="">
              <div className="landingname text-[#B7B7B7]">
                <p className="text-[clamp(2rem,0.1333rem+2.9167vw,4.8rem)] font-bold">
                  Xyrill Adrienne Combes
                </p>
              </div>
              <div className="">
                <div className="text-[clamp(3rem,-0.2rem+5vw,7.8rem)] font-bold mt-[2.5%]">
                  <p>Front-end</p>
                  <p>Developer &amp; Designer</p>
                </div>
              </div>
              <div className="">
                <p className="text-[clamp(1.1rem,0.2333rem+1.3542vw,2.4rem)] mt-[2.5%] text-[#A2A1A1]">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nostrum,
                  nulla. Recusandae obcaecati maiores natus non consequatur quae
                  cupiditate, ipsa odit.
                </p>
              </div>
              <div className="mt-[clamp(0.5rem,-2.1667rem+4.1667vw,4.5rem)]">
                <button className="button rounded-lg backdrop-blur-[3px] border-[clamp(0.0625rem,0.0446rem+0.0893vw,0.1875rem)] border-[#fdfcfc47] bg-linear-to-b from-[#1d1d1d] to-[#141414] p-[clamp(0.85rem,0.0833rem+1.1979vw,2rem)] cursor-pointer">
                  <div className="flex text-[clamp(1.25rem,0.0833rem+1.8229vw,3rem)]">
                    <p className="font-black ml-1">Download CV</p>
                    <i className="fa-regular fa-file ml-2 mt-1" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-[0_5%_5%]">
        <div className="p-[15%_1rem_0_1rem]">
          <div className="">
            <p className="text-[clamp(1.5rem,0.8571rem+3.2143vw,6rem)] font-black">
              Characteristics
            </p>
            <p className="text-[#9b9a9a] p-[0_3%_0_3%] text-[clamp(0.6875rem,0.4643rem+1.1161vw,2.25rem)]">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Labore et
              illum laborum, accusamus vel velit!
            </p>
          </div>
        </div>
      </div>
      <section className="m-[1rem_8%_7rem] md:m-[1rem_7%_7rem]">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[2%] grid-rows-fr">
          <div data-aos="zoom-in">
            <div className="contents">
              <div className="bg-linear-to-b from-[#1d1d1d] to-[#141414] rounded-[clamp(0.5rem,0.1661rem+0.5212vw,1rem)] h-full flex flex-col border-[#fdfcfc47] border-[clamp(0.0625rem,0.0446rem+0.0893vw,0.1875rem)] p-[10%]">
                <i className="fa-regular fa-alarm-clock text-[clamp(2.5rem,1.7143rem+3.9286vw,8rem)]" />
                <p className="font-black pt-[5%] text-[clamp(1.4rem,1.0286rem+1.8571vw,4rem)]">
                  Punctual
                </p>
                <p className="text-[#7a7a7a] text-[clamp(0.75rem,0.6179rem+0.6607vw,1.675rem)] m-1">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo
                  architecto nihil a, aspernatur quo quos neque laudantium nesciunt
                  pariatur at?
                </p>
                <p></p>
              </div>
            </div>
          </div>
          <div data-aos="zoom-in">
            <div className="contents">
              <div className="bg-linear-to-b from-[#1d1d1d] to-[#141414] rounded-[clamp(0.5rem,0.1661rem+0.5212vw,1rem)] h-full flex flex-col border-[clamp(0.0625rem,0.0446rem+0.0893vw,0.1875rem)] border-[#fdfcfc47] p-[10%]">
                <i className="fa-regular fa-lightbulb text-[clamp(2.5rem,1.7143rem+3.9286vw,8rem)]" />
                <p className="font-black pt-[5%] text-[clamp(1.4rem,1.0286rem+1.8571vw,4rem)]">
                  Motivation
                </p>
                <p className="text-[#7a7a7a] text-[clamp(0.75rem,0.6179rem+0.6607vw,1.675rem)] m-1">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic,
                  consectetur minima sit optio ipsum fuga odit sint eos corrupti
                  cum.
                </p>
              </div>
            </div>
          </div>
          <div data-aos="zoom-in">
            <div className="contents">
              <div className="bg-linear-to-b from-[#1d1d1d] to-[#141414] rounded-[clamp(0.5rem,0.1661rem+0.5212vw,1rem)] h-full flex flex-col border-[clamp(0.0625rem,0.0446rem+0.0893vw,0.1875rem)] border-[#fdfcfc47] p-[10%]">
                <i className="fa-regular fa-cloud text-[clamp(2.5rem,1.7143rem+3.9286vw,8rem)]" />
                <p className="font-black pt-[5%] text-[clamp(1.4rem,1.0286rem+1.8571vw,4rem)]">
                  Curiosity
                </p>
                <p></p>
                <p className="text-[#7a7a7a] text-[clamp(0.75rem,0.6179rem+0.6607vw,1.675rem)] m-1">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Hic quia
                  tenetur esse nostrum ea aperiam possimus cupiditate deserunt
                  consequatur itaque?
                </p>
              </div>
            </div>
          </div>
          <div data-aos="zoom-in">
            <div className="contents">
              <div className="bg-linear-to-b from-[#1d1d1d] to-[#141414] rounded-[clamp(0.5rem,0.1661rem+0.5212vw,1rem)] h-full flex flex-col border-[clamp(0.0625rem,0.0446rem+0.0893vw,0.1875rem)] border-[#fdfcfc47] p-[10%]">
                <i className="fa-solid fa-users text-[clamp(2.5rem,1.7143rem+3.9286vw,8rem)]" />
                <p className="font-black pt-[5%] text-[clamp(1.4rem,1.0286rem+1.8571vw,4rem)]">
                  Teamwork
                </p>
                <p className="text-[#7a7a7a] text-[clamp(0.75rem,0.6179rem+0.6607vw,1.675rem)] m-1">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit
                  odit nesciunt ratione dolorem soluta tempore accusantium quae ipsa
                  minima fugiat!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="p-[1%_8%_1%_8%]">
        <hr className="text-[#454444] font-thin" />
      </div>
      <section className="pb-12" id="about">
        <div className="p-[10%_9%_15%]">
          <div className="text-center md:text-left">
            <p className="text-[clamp(1.8125rem,0.9286rem+4.4196vw,8rem)] font-black">
              About Me
            </p>
            <p className="text-[clamp(0.6875rem,0.4643rem+1.1161vw,2.25rem)] text-[#A2A1A1]">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sint
              obcaecati recusandae assumenda quod sequi eaque, nihil omnis ex ut
              unde a dolorum possimus illum optio eos dolore est nostrum eum!
              Corporis, eligendi voluptatum quam aspernatur possimus amet tempora
              autem hic.
            </p>
            <p></p>
          </div>
        </div>
        <div className="text-center">
          <div className="p-[1%_10%_1%_10%]">
            <div className="">
              <p className="text-[clamp(1.5rem,0.8571rem+3.2143vw,6rem)] font-black">
                Skills and Knowledge
              </p>
              <p className="text-[#9b9a9a] text-[clamp(0.6875rem,0.4643rem+1.1161vw,2.25rem)]">
                UI / UX Designer • Front-end Developer • Responsive Web Performance
              </p>
            </div>
            <div className="grid grid-cols-1 pt-3">
              <div className="text-[clamp(1.25rem,0.7143rem+2.6786vw,5rem)]">
                <i className="fa-brands fa-html5" />
                <i className="fa-brands fa-css3-alt" />
                <i className="fa-brands fa-square-js" />
                <i className="fa-brands fa-tailwind-css" />
                <i className="fa-brands fa-node-js" />
                <i className="fa-brands fa-react" />
                <i className="fa-brands fa-bootstrap" />
              </div>
            </div>
          </div>
        </div>
        <div className="p-[0_10%_0_10%]">
          <p className="text-[#e6e4e4] font-black pt-[5%] text-[clamp(1.25rem,0.8571rem+1.9643vw,4rem)]">
            Front-end development
          </p>
          <p className="text-[#7a7a7a] text-[clamp(0.6875rem,0.4643rem+1.1161vw,2.25rem)] font-black">
            HTML • CSS • JavaScript
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 m-[1rem_12%] gap-[8%]">
          <div className="text-[#a19f9f]">
            <div className="mb-1 text-[clamp(0.75rem,0.6107rem+0.6964vw,1.725rem)]">
              HTML
            </div>
            <div className="p-[0_10px]">
              <div className="bg-linear-to-b from-[#1d1d1d] to-[#141414] rounded-[clamp(0.5rem,0.1661rem+0.5212vw,1rem)] border border-[#fdfcfc47] p-[clamp(0.4375rem,0.3661rem+0.3571vw,0.9375rem)] mt-[clamp(0.375rem,0.25rem+0.625vw,1.25rem)]">
                <div className="h-[clamp(0.75rem,0.6143rem+0.6786vw,1.7rem)] w-full overflow-hidden rounded bg-zinc-700/60">
                  <div
                    className="h-full rounded bg-zinc-200"
                    style={{ width: "95%" }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="text-[#a19f9f]">
            <div className="mb-1 text-[clamp(0.75rem,0.6107rem+0.6964vw,1.725rem)]">
              CSS
            </div>
            <div className="p-[0_10px]">
              <div className="bg-linear-to-b from-[#1d1d1d] to-[#141414] rounded-[clamp(0.5rem,0.1661rem+0.5212vw,1rem)] border border-[#fdfcfc47] p-[clamp(0.4375rem,0.3661rem+0.3571vw,0.9375rem)] mt-[clamp(0.375rem,0.25rem+0.625vw,1.25rem)]">
                <div className="h-[clamp(0.75rem,0.6143rem+0.6786vw,1.7rem)] w-full overflow-hidden rounded bg-zinc-700/60">
                  <div
                    className="h-full rounded bg-zinc-200"
                    style={{ width: "90%" }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="text-[#a19f9f]">
            <div className="mb-1 text-[clamp(0.75rem,0.6107rem+0.6964vw,1.725rem)]">
              JavaScript
            </div>
            <div className="p-[0_10px]">
              <div className="bg-linear-to-b from-[#1d1d1d] to-[#141414] rounded-[clamp(0.5rem,0.1661rem+0.5212vw,1rem)] border border-[#fdfcfc47] p-[clamp(0.4375rem,0.3661rem+0.3571vw,0.9375rem)] mt-[clamp(0.375rem,0.25rem+0.625vw,1.25rem)]">
                <div className="h-[clamp(0.75rem,0.6143rem+0.6786vw,1.7rem)] w-full overflow-hidden rounded bg-zinc-700/60">
                  <div
                    className="h-full rounded bg-zinc-200"
                    style={{ width: "55%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-[0_10%_0_10%]">
          <p className="text-[#e6e4e4] font-black pt-[5%] text-[clamp(1.25rem,0.8571rem+1.9643vw,4rem)]">
            Software Framework
          </p>
          <p className="text-[#7a7a7a] text-[clamp(0.6875rem,0.4643rem+1.1161vw,2.25rem)] font-black">
            Tailwind CSS • React.js • Node.js • Bootstrap
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 m-[1rem_12%] gap-[8%]">
          <div className="text-[#a19f9f]">
            <div className="mb-1 text-[clamp(0.75rem,0.6107rem+0.6964vw,1.725rem)]">
              Tailwind CSS
            </div>
            <div className="p-[0_10px]">
              <div className="bg-linear-to-b from-[#1d1d1d] to-[#141414] rounded-[clamp(0.5rem,0.1661rem+0.5212vw,1rem)] border border-[#fdfcfc47] p-[clamp(0.4375rem,0.3661rem+0.3571vw,0.9375rem)] mt-[clamp(0.375rem,0.25rem+0.625vw,1.25rem)]">
                <div className="h-[clamp(0.75rem,0.6143rem+0.6786vw,1.7rem)] w-full overflow-hidden rounded bg-zinc-700/60">
                  <div
                    className="h-full rounded bg-zinc-200"
                    style={{ width: "95%" }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="text-[#a19f9f]">
            <div className="mb-1 text-[clamp(0.75rem,0.6107rem+0.6964vw,1.725rem)]">
              React.js
            </div>
            <div className="p-[0_10px]">
              <div className="bg-linear-to-b from-[#1d1d1d] to-[#141414] rounded-[clamp(0.5rem,0.1661rem+0.5212vw,1rem)] border border-[#fdfcfc47] p-[clamp(0.4375rem,0.3661rem+0.3571vw,0.9375rem)] mt-[clamp(0.375rem,0.25rem+0.625vw,1.25rem)]">
                <div className="h-[clamp(0.75rem,0.6143rem+0.6786vw,1.7rem)] w-full overflow-hidden rounded bg-zinc-700/60">
                  <div
                    className="h-full rounded bg-zinc-200"
                    style={{ width: "60%" }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="text-[#a19f9f]">
            <div className="mb-1 text-[clamp(0.75rem,0.6107rem+0.6964vw,1.725rem)]">
              Node.js
            </div>
            <div className="p-[0_10px]">
              <div className="bg-linear-to-b from-[#1d1d1d] to-[#141414] rounded-[clamp(0.5rem,0.1661rem+0.5212vw,1rem)] border border-[#fdfcfc47] p-[clamp(0.4375rem,0.3661rem+0.3571vw,0.9375rem)] mt-[clamp(0.375rem,0.25rem+0.625vw,1.25rem)]">
                <div className="h-[clamp(0.75rem,0.6143rem+0.6786vw,1.7rem)] w-full overflow-hidden rounded bg-zinc-700/60">
                  <div
                    className="h-full rounded bg-zinc-200"
                    style={{ width: "50%" }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="text-[#a19f9f]">
            <div className="mb-1 text-[clamp(0.75rem,0.6107rem+0.6964vw,1.725rem)]">
              Bootstrap
            </div>
            <div className="p-[0_10px]">
              <div className="bg-linear-to-b from-[#1d1d1d] to-[#141414] rounded-[clamp(0.5rem,0.1661rem+0.5212vw,1rem)] border border-[#fdfcfc47] p-[clamp(0.4375rem,0.3661rem+0.3571vw,0.9375rem)] mt-[clamp(0.375rem,0.25rem+0.625vw,1.25rem)]">
                <div className="h-[clamp(0.75rem,0.6143rem+0.6786vw,1.7rem)] w-full overflow-hidden rounded bg-zinc-700/60">
                  <div
                    className="h-full rounded bg-zinc-200"
                    style={{ width: "80%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="m-[6rem_7%_7rem] sm:mt-[7%] grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[2%] grid-rows-fr">
          <div data-aos="zoom-in">
            <div className="contents">
              <div className="bg-linear-to-b from-[#1d1d1d] to-[#141414] rounded-[clamp(0.5rem,0.1661rem+0.5212vw,1rem)] h-full flex flex-col border border-[#fdfcfc47] p-[10%]">
                <i className="fa-solid fa-brush text-[clamp(2.5rem,1.7143rem+3.9286vw,8rem)]" />
                <p className="text-[#e6e4e4] font-black text-[clamp(1.25rem,0.8571rem+1.9643vw,4rem)] pt-[5%] lg:pb-5">
                  UI / UX Designer
                </p>
                <p className="text-[#7a7a7a] text-[clamp(0.75rem,0.6179rem+0.6607vw,1.675rem)] m-1">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione,
                  minus fugit. Incidunt commodi eos quod a id
                </p>
              </div>
            </div>
          </div>
          <div data-aos="zoom-in">
            <div className="contents">
              <div className="bg-linear-to-b from-[#1d1d1d] to-[#141414] rounded-[clamp(0.5rem,0.1661rem+0.5212vw,1rem)] h-full flex flex-col border border-[#fdfcfc47] p-[10%]">
                <i className="fa-solid fa-computer text-[clamp(2.5rem,1.7143rem+3.9286vw,8rem)]" />
                <p className="text-[#e6e4e4] font-black text-[clamp(1.25rem,0.8571rem+1.9643vw,4rem)] pt-[5%] lg:pb-5">
                  Front-end Developer
                </p>
                <p className="text-[#7a7a7a] text-[clamp(0.75rem,0.6179rem+0.6607vw,1.675rem)] m-1">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione,
                  minus fugit. Incidunt commodi eos quod a id
                </p>
              </div>
            </div>
          </div>
          <div data-aos="zoom-in">
            <div className="contents">
              <div className="bg-linear-to-b from-[#1d1d1d] to-[#141414] rounded-[clamp(0.5rem,0.1661rem+0.5212vw,1rem)] h-full flex flex-col border border-[#fdfcfc47] p-[10%]">
                <i className="fa-solid fa-tablet-screen-button text-[clamp(2.5rem,1.7143rem+3.9286vw,8rem)]" />
                <p className="text-[#e6e4e4] font-black text-[clamp(1.25rem,0.8571rem+1.9643vw,4rem)] pt-[5%] lg:pb-5">
                  Responsive Performance
                </p>
                <p className="text-[#7a7a7a] text-[clamp(0.75rem,0.6179rem+0.6607vw,1.675rem)] m-1">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione,
                  minus fugit. Incidunt commodi eos quod a id
                </p>
              </div>
            </div>
          </div>
          <div data-aos="zoom-in">
            <div className="contents">
              <div className="bg-linear-to-b from-[#1d1d1d] to-[#141414] rounded-[clamp(0.5rem,0.1661rem+0.5212vw,1rem)] h-full flex flex-col border border-[#fdfcfc47] p-[10%]">
                <i className="fa-solid fa-code-branch text-[clamp(2.5rem,1.7143rem+3.9286vw,8rem)]" />
                <p className="text-[#e6e4e4] font-black text-[clamp(1.25rem,0.8571rem+1.9643vw,4rem)] pt-[5%] lg:pb-5">
                  Version Control
                </p>
                <p className="text-[#7a7a7a] text-[clamp(0.75rem,0.6179rem+0.6607vw,1.675rem)] m-1">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione,
                  minus fugit. Incidunt commodi eos quod a id
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="p-[2%_8%_2%_8%]">
        <hr className="text-[#454444] font-thin" />
      </div>
      <section id="projects" className="w-full">
        <div className="w-full pb-[10%]">
          <div className="p-[10%_8.5%_10%]">
            <p className="text-[clamp(1.8125rem,0.9286rem+4.4196vw,8rem)] font-black">
              Projects &amp; Works
            </p>
            <p className="text-[clamp(0.6875rem,0.4643rem+1.1161vw,2.25rem)] text-[#A2A1A1] pt-3">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsa
              cupiditate impedit corrupti dolorum repudiandae dignissimos repellat.
              Ratione quam, quae incidunt aut vero sapiente illum, laudantium minima
              ipsam praesentium provident fuga!
            </p>
          </div>
          <div className="p-[0_11%]">
            <div className="w-full">
              <p className="font-black text-[clamp(1.5rem,0.8571rem+3.2143vw,6rem)]  leading-tight">
                Ecoscapes
              </p>
              <div className="text-[clamp(0.625rem,0.4429rem+0.9107vw,1.9rem)] text-[#d5d3d3 pt-2">
                <ul className="flex flex-wrap gap-1.5 pt-[0.2rem] list-none">
                  <li className="rounded-md backdrop-blur-[3px] border border-solid border-xs border-[#fdfcfc47] bg-linear-to-b from-[#1d1d1d] to-[#141414] p-[4px_6px]">
                    HTML
                  </li>
                  <li className="rounded-md backdrop-blur-[3px] border border-solid border-xs border-[#fdfcfc47] bg-linear-to-b from-[#1d1d1d] to-[#141414] p-[4px_6px]">
                    CSS
                  </li>
                  <li className="rounded-md backdrop-blur-[3px] border border-solid border-xs border-[#fdfcfc47] bg-linear-to-b from-[#1d1d1d] to-[#141414] p-[4px_6px]">
                    JavaScript
                  </li>
                </ul>
              </div>
              <p className="text-[#9b9a9a] text-[clamp(0.6875rem,0.4643rem+1.1161vw,2.25rem)] p-[1rem_0_clamp(1rem,2vw,2rem)]">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias
                laudantium incidunt voluptas.
              </p>
              <div
                data-gallery=""
                className="w-full backdrop-blur-[3px] border border-solid border-xs border-[#fdfcfc47] bg-linear-to-b from-[#1d1d1d] to-[#141414] rounded-sm p-[clamp(0.375rem,0.1rem+1.4vw,1.25rem)]"
              >
                <div className="flex flex-wrap items-center justify-between gap-[clamp(0.375rem,0.1rem+1vw,1rem)]">
                  <button
                    type="button"
                    data-prev=""
                    aria-label="Previous image"
                    className="hidden md:flex order-2 sm:order-1 btn btn-circle shrink-0 min-h-0 p-0 h-[clamp(1.75rem,1.2rem+2.2vw,3.5rem)] w-[clamp(1.75rem,1.2rem+2.2vw,3.5rem)] text-[clamp(0.75rem,0.5rem+1vw,1.5rem)] backdrop-blur-md border border-white/40 bg-linear-to-b from-[#22222274] to-[#17171781] text-white hover:border-white hover:scale-105 transition-all"
                  >
                    ❮
                  </button>
                  <div
                    data-track=""
                    tabIndex={0}
                    aria-label="Ecoscapes screenshots"
                    className="order-1 sm:order-2 carousel w-full sm:w-auto sm:flex-1 min-w-0 overflow-x-auto overscroll-x-contain rounded-sm focus-visible:outline-2 focus-visible:outline-white"
                  >
                    <div className="carousel-item w-full">
                      <img
                        src="./src/img/Ecoscapes1.png"
                        alt="Ecoscapes slide 1"
                        width={1920}
                        height={1080}
                        className="w-full h-auto object-cover aspect-video"
                      />
                    </div>
                    <div className="carousel-item w-full">
                      <img
                        src="./src/img/Ecoscapes2.png"
                        alt="Ecoscapes slide 2"
                        width={1920}
                        height={1080}
                        loading="lazy"
                        className="w-full h-auto object-cover aspect-video"
                      />
                    </div>
                    <div className="carousel-item w-full">
                      <img
                        src="./src/img/Ecoscapes3.png"
                        alt="Ecoscapes slide 3"
                        width={1920}
                        height={1080}
                        loading="lazy"
                        className="w-full h-auto object-cover aspect-video"
                      />
                    </div>
                    <div className="carousel-item w-full">
                      <img
                        src="./src/img/Ecoscapes4.png"
                        alt="Ecoscapes slide 4"
                        width={1920}
                        height={1080}
                        loading="lazy"
                        className="w-full h-auto object-cover aspect-video"
                      />
                    </div>
                    <div className="carousel-item w-full">
                      <img
                        src="./src/img/Ecoscapes5.png"
                        alt="Ecoscapes slide 5"
                        width={1920}
                        height={1080}
                        loading="lazy"
                        className="w-full h-auto object-cover aspect-video"
                      />
                    </div>
                    <div className="carousel-item w-full">
                      <img
                        src="./src/img/Ecoscapes6.png"
                        alt="Ecoscapes slide 6"
                        width={1920}
                        height={1080}
                        loading="lazy"
                        className="w-full h-auto object-cover aspect-video"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    data-next=""
                    aria-label="Next image"
                    className="hidden md:flex order-3 shrink-0 btn btn-circle min-h-0 p-0 h-[clamp(1.75rem,1.2rem+2.2vw,3.5rem)] w-[clamp(1.75rem,1.2rem+2.2vw,3.5rem)] text-[clamp(0.75rem,0.5rem+1vw,1.5rem)] backdrop-blur-md border border-white/40 bg-linear-to-b from-[#22222274] to-[#17171781] text-white hover:border-white hover:scale-105 transition-all"
                  >
                    ❯
                  </button>
                </div>
                <p
                  data-counter=""
                  aria-live="polite"
                  className="hidden md:block text-right text-[#9b9a9a] text-[clamp(0.625rem,0.4429rem+0.9107vw,1.9rem)] pt-2"
                >
                  1 / 6
                </p>
                <div
                  data-thumbs=""
                  className="mt-2 flex gap-[clamp(0.25rem,0.1rem+0.6vw,0.75rem)] overflow-x-auto pb-1 scrollbar-thin"
                >
                  <a
                    href="#"
                    data-thumb=""
                    aria-label="Show image 1"
                    className="shrink-0 w-[clamp(7rem,4.4286rem+12.8571vw,25rem)] h-auto aspect-video overflow-hidden border border-white/20 opacity-70 hover:opacity-100 hover:border-white/60 aria-current:opacity-100 aria-current:border-white transition-all focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <img
                      src="./src/img/Ecoscapes1.png"
                      alt="Thumbnail 1"
                      loading="lazy"
                      className="w-full object-cover"
                    />
                  </a>
                  <a
                    href="#"
                    data-thumb=""
                    aria-label="Show image 2"
                    className="shrink-0 w-[clamp(7rem,4.4286rem+12.8571vw,25rem)] h-auto aspect-video overflow-hidden border border-white/20 opacity-70 hover:opacity-100 hover:border-white/60 aria-current:opacity-100 aria-current:border-white transition-all focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <img
                      src="./src/img/Ecoscapes2.png"
                      alt="Thumbnail 2"
                      loading="lazy"
                      className="w-full object-cover"
                    />
                  </a>
                  <a
                    href="#"
                    data-thumb=""
                    aria-label="Show image 3"
                    className="shrink-0 w-[clamp(7rem,4.4286rem+12.8571vw,25rem)] h-auto aspect-video overflow-hidden border border-white/20 opacity-70 hover:opacity-100 hover:border-white/60 aria-current:opacity-100 aria-current:border-white transition-all focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <img
                      src="./src/img/Ecoscapes3.png"
                      alt="Thumbnail 3"
                      loading="lazy"
                      className="w-full object-cover"
                    />
                  </a>
                  <a
                    href="#"
                    data-thumb=""
                    aria-label="Show image 4"
                    className="shrink-0 w-[clamp(7rem,4.4286rem+12.8571vw,25rem)] h-auto aspect-video overflow-hidden border border-white/20 opacity-70 hover:opacity-100 hover:border-white/60 aria-current:opacity-100 aria-current:border-white transition-all focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <img
                      src="./src/img/Ecoscapes4.png"
                      alt="Thumbnail 4"
                      loading="lazy"
                      className="w-full object-cover"
                    />
                  </a>
                  <a
                    href="#"
                    data-thumb=""
                    aria-label="Show image 5"
                    className="shrink-0 w-[clamp(7rem,4.4286rem+12.8571vw,25rem)] h-auto aspect-video overflow-hidden border border-white/20 opacity-70 hover:opacity-100 hover:border-white/60 aria-current:opacity-100 aria-current:border-white transition-all focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <img
                      src="./src/img/Ecoscapes5.png"
                      alt="Thumbnail 5"
                      loading="lazy"
                      className="w-full object-cover"
                    />
                  </a>
                  <a
                    href="#"
                    data-thumb=""
                    aria-label="Show image 6"
                    className="shrink-0 w-[clamp(7rem,4.4286rem+12.8571vw,25rem)] h-auto aspect-video overflow-hidden border border-white/20 opacity-70 hover:opacity-100 hover:border-white/60 aria-current:opacity-100 aria-current:border-white transition-all focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <img
                      src="./src/img/Ecoscapes6.png"
                      alt="Thumbnail 6"
                      loading="lazy"
                      className="w-full object-cover"
                    />
                  </a>
                </div>
              </div>
            </div>
            <div className="w-full">
              <p className="text-[#e6e4e4] font-black pt-[5%] text-[clamp(1.5rem,0.8571rem+3.2143vw,6rem)]  leading-tight">
                Other design works
              </p>
              <p className="text-[#9b9a9a] text-[clamp(0.6875rem,0.4643rem+1.1161vw,2.25rem)] p-[0,1rem_0_clamp(1rem,2vw,2rem),1rem_0_clamp(1rem,2vw,2rem)]">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              </p>
              <div
                data-gallery=""
                className="w-full mt-[1.2rem] backdrop-blur-[3px] border border-solid border-xs border-[#fdfcfc47] bg-linear-to-b from-[#1d1d1d] to-[#141414] rounded-sm p-[clamp(0.375rem,0.1rem+1.4vw,1.25rem)]"
              >
                <div className="flex flex-wrap items-center justify-between gap-[clamp(0.375rem,0.1rem+1vw,1rem)]">
                  <button
                    type="button"
                    data-prev=""
                    aria-label="Previous image"
                    className="hidden md:flex order-2 sm:order-1 btn btn-circle shrink-0 min-h-0 p-0 h-[clamp(1.75rem,1.2rem+2.2vw,3.5rem)] w-[clamp(1.75rem,1.2rem+2.2vw,3.5rem)] text-[clamp(0.75rem,0.5rem+1vw,1.5rem)] backdrop-blur-md border border-white/40 bg-linear-to-b from-[#22222274] to-[#17171781] text-white hover:border-white hover:scale-105 transition-all"
                  >
                    ❮
                  </button>
                  <div
                    data-track=""
                    tabIndex={0}
                    aria-label="Other design works"
                    className="order-1 sm:order-2 carousel w-full sm:w-auto sm:flex-1 min-w-0 overflow-x-auto overscroll-x-contain rounded-sm focus-visible:outline-2 focus-visible:outline-white"
                  >
                    <div className="carousel-item w-full">
                      <img
                        src="./src/img/other1.png"
                        alt="Other design work 1"
                        width={1920}
                        height={1080}
                        loading="lazy"
                        className="w-full h-auto object-cover aspect-video"
                      />
                    </div>
                    <div className="carousel-item w-full">
                      <img
                        src="./src/img/other2.png"
                        alt="Other design work 2"
                        width={1920}
                        height={1080}
                        loading="lazy"
                        className="w-full h-auto object-cover aspect-video"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    data-next=""
                    aria-label="Next image"
                    className="hidden md:flex order-3 shrink-0 btn btn-circle min-h-0 p-0 h-[clamp(1.75rem,1.2rem+2.2vw,3.5rem)] w-[clamp(1.75rem,1.2rem+2.2vw,3.5rem)] text-[clamp(0.75rem,0.5rem+1vw,1.5rem)] backdrop-blur-md border border-white/40 bg-linear-to-b from-[#22222274] to-[#17171781] text-white hover:border-white hover:scale-105 transition-all"
                  >
                    ❯
                  </button>
                </div>
                <p
                  data-counter=""
                  aria-live="polite"
                  className="hidden md:block text-right text-[#9b9a9a] text-[clamp(0.625rem,0.4429rem+0.9107vw,1.9rem)] pt-2"
                >
                  1 / 2
                </p>
                <div
                  data-thumbs=""
                  className="mt-2 flex gap-[clamp(0.25rem,0.1rem+0.6vw,0.75rem)] overflow-x-auto pb-1 scrollbar-thin"
                >
                  <a
                    href="#"
                    data-thumb=""
                    aria-label="Show image 1"
                    className="shrink-0 w-[clamp(7rem,4.4286rem+12.8571vw,25rem)] h-auto aspect-video overflow-hidden border border-white/20 opacity-70 hover:opacity-100 hover:border-white/60 aria-current:opacity-100 aria-current:border-white transition-all focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <img
                      src="./src/img/other1.png"
                      alt="Thumbnail 1"
                      loading="lazy"
                      className="w-full object-cover"
                    />
                  </a>
                  <a
                    href="#"
                    data-thumb=""
                    aria-label="Show image 2"
                    className="shrink-0 w-[clamp(7rem,4.4286rem+12.8571vw,25rem)] h-auto aspect-video overflow-hidden border border-white/20 opacity-70 hover:opacity-100 hover:border-white/60 aria-current:opacity-100 aria-current:border-white transition-all focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <img
                      src="./src/img/other2.png"
                      alt="Thumbnail 2"
                      loading="lazy"
                      className="w-full object-cover"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer
        className="footer p-[clamp(2rem,1.3571rem+3.2143vw,6.5rem)] bg-linear-to-b from-[#1a1a1a82] to-[#0f0f0f70] backdrop-blur-md border-t border-[#fdfcfc47] grid grid-cols-1 sm:grid-cols-2 sm:gap-[10%] text-[#cbcaca]"
        id="contacts"
      >
        <div className="flex flex-col justify-between space-y-[clamp(1rem,0.7143rem+1.4286vw,3rem)]">
          <div className="flex items-start">
            <i className="fa-solid fa-location-dot text-[clamp(1.5rem,1rem+2.5vw,5rem)] text-[#fdfcfc] mt-1 shrink-0" />
            <div className="text-[clamp(0.75rem,0.6179rem+0.6607vw,1.675rem)] pl-4 leading-relaxed ">
              <p>367 Doña Donisia, Bayan Luma II</p>
              <p>Imus City, Cavite, Philippines</p>
            </div>
          </div>
          <div className="flex items-center">
            <i className="fa-solid fa-phone text-[clamp(1.5rem,1rem+2.5vw,5rem)] text-[#fdfcfc] shrink-0" />
            <a
              href="tel:+639605599276"
              className="text-[clamp(0.75rem,0.6179rem+0.6607vw,1.675rem)] pl-4 hover:text-white transition-colors"
            >
              +63 960 559 9276
            </a>
          </div>
          <div className="flex items-start">
            <i className="fa-solid fa-envelope text-[clamp(1.5rem,1rem+2.5vw,5rem)] text-[#fdfcfc] mt-1 shrink-0" />
            <div className="text-[clamp(0.75rem,0.6179rem+0.6607vw,1.675rem)] pl-4 leading-relaxed">
              <p>
                <a
                  href="mailto:combesxyrill@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  combesxyrill@gmail.com
                </a>
              </p>
              <p>
                <a
                  href="mailto:xyrilladrienne.combes@cvsu.edu.ph"
                  className="hover:text-white transition-colors"
                >
                  xyrilladrienne.combes@cvsu.edu.ph
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between text-center sm:text-left">
          <div>
            <p className="text-[clamp(1.25rem,0.8571rem+1.9643vw,4rem)] font-black text-white tracking-wide">
              Social Media
            </p>
            <p className="text-[clamp(0.75rem,0.6179rem+0.6607vw,1.675rem)] text-[#a4a2a2] leading-relaxed p-[clamp(0.5rem,0.1429rem+1.7857vw,3rem)_0.25rem]">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Neque vitae
              ipsum iure repellendus aspernatur!
            </p>
          </div>
          <div className="flex w-full items-center justify-center sm:justify-start gap-4 text-[clamp(1.5rem,0.8571rem+3.2143vw,6rem)] text-[#faf9f9] text-center sm:text-left">
            <a
              href="https://www.facebook.com/xyrilladrienne.combes/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-white transition-colors"
            >
              <i className="fa-brands fa-square-facebook" />
            </a>
            <a
              href="https://ph.pinterest.com/ValkyrieMaster/_profile/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Pinterest"
              className="hover:text-white transition-colors"
            >
              <i className="fa-brands fa-square-pinterest" />
            </a>
            <a
              href="https://github.com/Adrienne-2005"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hover:text-white transition-colors"
            >
              <i className="fa-brands fa-square-github" />
            </a>
            <a
              href="https://reddit.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Reddit"
              className="hover:text-white transition-colors"
            >
              <i className="fa-brands fa-square-reddit" />
            </a>
          </div>
        </div>
      </footer>
    </>


  )
}

export default App
