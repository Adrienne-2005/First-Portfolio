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
    AOS.init({ 
      duration: 400, 
      once: true, 
      disable: 'mobile', 
      easing: 'ease-out-cubic' });
    AOS.refresh();

    var controller = new AbortController();
    var projects = document.getElementById('projects') || document;
    var galleries = findByAttr(projects, 'div', 'data-gallery');
    for (var g = 0; g < galleries.length; g++) {
      initGallery(galleries[g], controller.signal);
    }

    return function () {
      controller.abort();
    };
  }, []);

  return (
    <>
      <header className="font-black">
        <div className="navbar fixed inset-x-0 z-50 min-h-auto bg-linear-to-b from-[#1a1a1a69] to-[#0f0f0f62] backdrop-blur-sm border-b-[clamp(0.0625rem,0.0446rem+0.0893vw,0.1875rem)] border-[#fdfcfc47] text-[clamp(0.875rem,0.6286rem+1.2321vw,2.6rem)] p-[1.25%_3.5%]">
          <div className="navbar-start min-w-0 flex-1">
            <a href="#home" className=" pl-2.5">Xyrill Adrienne Combes</a>
          </div>

          <div className="navbar-end w-auto md:hidden">
            <div className="dropdown dropdown-end">
              <button aria-label="Menu" className="btn btn-ghost btn-sm transition-all duration-300 hover:bg-[#ffffff1f] focus:bg-[#ffffff1f]">
                <i className="fa-solid fa-bars" />
              </button>

              <ul className="menu dropdown-content mt-5 backdrop-blur-2xl w-[clamp(8.75rem,5.7143rem+15.1786vw,13rem)] rounded-box z-50 border bg-linear-to-b from-[#181818d9] to-[#111111d8] border-[#fdfcfc47] text-[clamp(0.875rem,0.6071rem+1.3393vw,1.25rem)]">
                <div className="p-[5%]">
                  <li><a href="#home" className="hover:bg-[#ffffff1f] active:bg-primary">Home</a></li>
                  <li><a href="#about" className="hover:bg-[#ffffff1f] active:bg-primary">About</a></li>
                  <li><a href="#projects" className="hover:bg-[#ffffff1f] active:bg-primary">Projects</a></li>
                  <li><a href="#contacts" className="hover:bg-[#ffffff1f] active:bg-primary">Contacts</a></li>
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
      
      <div id="home">
        <section className="pt-24 lg:hidden text-center relative isolate overflow-hidden pb-[10%] border-b-[clamp(0.0625rem,0.0446rem+0.0893vw,0.1875rem)] border-[#fdfcfc43]">
          <div className="">
            <img src="/src/img/banner.jpg" alt="" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-20" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-[5%] flex justify-center items-center">
              <i className="fa-regular fa-circle-user text-[clamp(10rem,2.8412rem+35.7942vw,20rem)]" />
            </div>

            <div className="">
              <div className=" p-[1rem_5%_8.5%_5%]">
                <p className="font-black text-[clamp(1.25rem,0.8571rem+1.9643vw,4rem)] text-[#B7B7B7]">Xyrill Adrienne Combes</p>

                <div className="text-[clamp(1.8125rem,0.8729rem+4.698vw,3.125rem)] font-black -space-y-2">
                  <p className="pt-1">Front-end Developer</p>
                  <p className="">and Designer</p>
                </div>
                
                <p className="text-[clamp(0.6875rem,0.4643rem+1.1161vw,2.25rem)] text-[#A2A1A1] p-[0.55rem_5%_0%_5%]"> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptas exercitationem voluptatum molestias nesciunt praesentium officiis. Sed reiciendis sint vitae eos.</p>
              </div>

              <div className="">
                <div className="pb-8">
                  <button className="button rounded-lg backdrop-blur-[3px] border-[clamp(0.0625rem,0.0446rem+0.0893vw,0.1875rem)] border-[#fdfcfc47] bg-linear-to-b from-[#212020] to-[#131313] p-[clamp(0.55rem,0.371rem+0.8949vw,0.8rem)] cursor-pointer">
                    <div className="flex">
                      <p className="font-black text-[clamp(0.875rem,0.5618rem+1.566vw,1.3125rem)] ml-1">Download CV</p>
                      <i className="fa-regular fa-file ml-2 mt-1 text-[clamp(0.875rem,0.5618rem+1.566vw,1.3125rem)]" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="hidden lg:block relative isolate overflow-hidden pb-[10%] border-b-[clamp(0.0625rem,0.0446rem+0.0893vw,0.1875rem)] border-[#fdfcfc43]">
          <img src="/src/img/banner.jpg" alt="" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-70" />

          <div className="absolute inset-0 -z-10 bg-linear-to-r from-[#111111]/50 to-[#111111dc] to-50%" />

          <div className="relative">
            <div className="grid grid-cols-2 relative pt-[clamp(11rem,4.3333rem+10.4167vw,21rem)] pr-[5%]">
              <div data-aos="fade-right" data-aos-duration="1000" className="flex justify-center items-center">
                <i className="fa-regular fa-circle-user text-[clamp(20rem,0rem+31.25vw,50rem)]"/>
              </div>

              <div>
                <div className="text-[#B7B7B7]" data-aos="fade-left" data-aos-duration="1000">
                  <p className="text-[clamp(2rem,0.1333rem+2.9167vw,4.8rem)] font-bold">Xyrill Adrienne Combes</p>
                </div>

                <div className="text-[clamp(3rem,-0.2rem+5vw,7.8rem)] font-bold mt-[2.5%]">
                  <p data-aos="fade-left" data-aos-duration="1000" data-aos-delay="50">Front-end</p>
                  <p data-aos="fade-left" data-aos-duration="1000" data-aos-delay="100">Developer & Designer</p>
                </div>

                <div data-aos="fade-up" data-aos-duration="1000"data-aos-delay="150" >
                  <p className="text-[clamp(1.1rem,0.2333rem+1.3542vw,2.4rem)] mt-[2.5%] text-[#A2A1A1]">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nostrum, nulla. Recusandae obcaecati maiores natus non consequatur quae cupiditate, ipsa odit.</p>

                  <div className="mt-[clamp(2rem,0.3333rem+2.6042vw,4.5rem)] pl-[3%]">
                    <button className="button rounded-lg backdrop-blur-[3px] border-[clamp(0.0625rem,0.0446rem+0.0893vw,0.1875rem)] border-[#fdfcfc47] bg-linear-to-b from-[#1b1a1a7c] to-[#0e0e0e6a] p-[clamp(0.85rem,0.0833rem+1.1979vw,2rem)] cursor-pointer">
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
        </section>
      </div>

      <main className='bg-radial-[at_100%_0%] bg-[#1c1c1c] from-[#161616] to-[#100f0f] to-100% relative'>
        <div data-aos="zoom-in" className="p-[clamp(2.5rem,1.6rem+4.5vw,7rem)_7%] relative">
          <hr className="text-[#6d6b6b] font-thin" />
        </div>

        <div className="p-[0_7%_2rem_7%]">
          <div className="">
            <p data-aos="fade-left" data-aos-duration="500" className="text-[clamp(1.5rem,0.8571rem+3.2143vw,6rem)] font-black">Characteristics</p>
            <p data-aos="fade-left" data-aos-duration="500" className="text-[#9b9a9a] p-[0_3%_0_3%] text-[clamp(0.6875rem,0.4643rem+1.1161vw,2.25rem)]">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Labore etillum laborum, accusamus vel velit!</p>
          </div>
        </div>

        <section className="m-[1rem_8%_1rem] md:m-[1rem_7%_1rem]">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[2%] auto-rows-fr">
            <div data-aos="zoom-in" data-aos-delay="0" data-aos-duration="500">
              <div className="contents">
                <div className="bg-linear-to-b from-[#1b1a1abd] to-[#18171787] backdrop-blur-xl rounded-[clamp(0.5rem,0.1661rem+0.5212vw,1rem)] h-full flex flex-col border-[#fdfcfc47] border-[clamp(0.0625rem,0.0446rem+0.0893vw,0.1875rem)] p-[10%]">
                  <i className="fa-regular fa-alarm-clock text-[clamp(2.5rem,1.9286rem+2.8571vw,6.5rem)] " />
                  <p className="font-black pt-[5%] text-[clamp(1.4rem,1.1rem+1.5vw,3.5rem)]">Punctual</p>
                  <p className="text-[#7a7a7a] text-[clamp(0.75rem,0.6429rem+0.5357vw,1.5rem)] m-1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicaboarchitecto nihil a, aspernatur quo quos neque laudantium nesciuntpariatur at?</p>
                </div>
              </div>
            </div>

            <div data-aos="zoom-in" data-aos-delay="50" data-aos-duration="500">
              <div className="contents">
                <div className="bg-linear-to-b from-[#1b1a1abd] to-[#18171787] backdrop-blur-xl rounded-[clamp(0.5rem,0.1661rem+0.5212vw,1rem)] h-full flex flex-col border-[clamp(0.0625rem,0.0446rem+0.0893vw,0.1875rem)] border-[#fdfcfc47] p-[10%]">
                  <i className="fa-regular fa-lightbulb text-[clamp(2.5rem,1.9286rem+2.8571vw,6.5rem)]" />
                  <p className="font-black pt-[5%] text-[clamp(1.4rem,1.1rem+1.5vw,3.5rem)]">Motivation</p>
                  <p className="text-[#7a7a7a] text-[clamp(0.75rem,0.6429rem+0.5357vw,1.5rem)] m-1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic,consectetur minima sit optio ipsum fuga odit sint eos corrupticum.</p>
                </div>
              </div>
            </div>

            <div data-aos="zoom-in" data-aos-delay="100" data-aos-duration="500">
              <div className="contents">
                <div className="bg-linear-to-b from-[#1b1a1abd] to-[#18171787] backdrop-blur-xl rounded-[clamp(0.5rem,0.1661rem+0.5212vw,1rem)] h-full flex flex-col border-[clamp(0.0625rem,0.0446rem+0.0893vw,0.1875rem)] border-[#fdfcfc47] p-[10%]">
                  <i className="fa-regular fa-cloud text-[clamp(2.5rem,1.9286rem+2.8571vw,6.5rem)]" />
                  <p className="font-black pt-[5%] text-[clamp(1.4rem,1.1rem+1.5vw,3.5rem)]">Curiosity</p>
                  <p className="text-[#7a7a7a] text-[clamp(0.75rem,0.6429rem+0.5357vw,1.5rem)] m-1">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Hic quiatenetur esse nostrum ea aperiam possimus cupiditate deseruntconsequatur itaque?</p>
                </div>
              </div>
            </div>

            <div data-aos="zoom-in" data-aos-delay="150" data-aos-duration="500">
              <div className="contents">
                <div className="bg-linear-to-b from-[#1b1a1abd] to-[#18171787] backdrop-blur-xl rounded-[clamp(0.5rem,0.1661rem+0.5212vw,1rem)] h-full flex flex-col border-[clamp(0.0625rem,0.0446rem+0.0893vw,0.1875rem)] border-[#fdfcfc47] p-[10%]">
                  <i className="fa-solid fa-users text-[clamp(2.5rem,1.9286rem+2.8571vw,6.5rem)]" />
                  <p className="font-black pt-[5%] text-[clamp(1.4rem,1.1rem+1.5vw,3.5rem)]">Teamwork</p>
                  <p className="text-[#7a7a7a] text-[clamp(0.75rem,0.6429rem+0.5357vw,1.5rem)] m-1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Impeditodit nesciunt ratione dolorem soluta tempore accusantium quae ipsaminima fugiat!</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div data-aos="zoom-in" className="p-[clamp(2.5rem,1.6rem+4.5vw,7rem)_7%] relative">
          <hr className="text-[#6d6b6b] font-thin" />
        </div>
      </main>

      <section className="relative isolate overflow-hidden" id="about">
        <div className="p-[7%_8.5%_7%]  relative border-y-[clamp(0.0625rem,0.0536rem+0.0446vw,0.125rem)] border-[#fdfcfc43]">
          <img src="/src/img/banner.jpg" alt="" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-75s" />

          <div className="absolute inset-0 -z-10 bg-linear-to-l from-[#111111]/50 to-[#111111dc] to-25%" />

          <div className="relative">
            <p data-aos="fade-left" data-aos-duration="500" className="text-[clamp(1.8125rem,0.9286rem+4.4196vw,8rem)] font-black">About Me</p>
            <p data-aos="fade-left" data-aos-duration="500" className="text-[clamp(0.6875rem,0.4643rem+1.1161vw,2.25rem)] text-[#A2A1A1]">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sintobcaecati recusandae assumenda quod sequi eaque, nihil omnis ex utunde a dolorum possimus illum optio eos dolore est nostrum eum!Corporis, eligendi voluptatum quam aspernatur possimus amet temporaautem hic.</p>
          </div>
        </div>

        <div className="bg-radial-[at_100%_0%] bg-[#1c1c1c] from-[#161616] to-[#100f0f] to-100% relative">
          <div data-aos="zoom-in" className="p-[clamp(2.5rem,1.6rem+4.5vw,7rem)_7%] relative">
            <hr className="text-[#6d6b6b] font-thin" />
          </div>

          <div className="text-center">
            <div className="p-[0_10%]">
              <div className="">
                <p data-aos="fade-up" data-aos-duration="500" className="text-[clamp(1.5rem,0.8571rem+3.2143vw,6rem)] font-black">Skills and Knowledge</p>
                <p data-aos="fade-up" data-aos-duration="500" className="text-[#9b9a9a] text-[clamp(0.6875rem,0.4643rem+1.1161vw,2.25rem)]">UI / UX Web Designer • Front-end Developer • Responsive Web Performance</p>
              </div>

              <div data-aos="fade-up" data-aos-duration="500" data-aos-delay="60" className="grid grid-cols-1 pt-3">
                <div className="text-[clamp(1.25rem,0.7143rem+2.6786vw,5rem)] flex justify-center gap-[1.5%]">
                  <i data-aos="zoom-in" data-aos-duration="500" data-aos-delay="0" className="fa-brands fa-html5" />
                  <i data-aos="zoom-in" data-aos-duration="500" data-aos-delay="50" className="fa-brands fa-css3-alt" />
                  <i data-aos="zoom-in" data-aos-duration="500" data-aos-delay="100" className="fa-brands fa-square-js" />
                  <i data-aos="zoom-in" data-aos-duration="500" data-aos-delay="150" className="fa-brands fa-tailwind-css" />
                  <i data-aos="zoom-in" data-aos-duration="500" data-aos-delay="200" className="fa-brands fa-node-js" />
                  <i data-aos="zoom-in" data-aos-duration="500" data-aos-delay="250" className="fa-brands fa-react" />
                  <i data-aos="zoom-in" data-aos-duration="500" data-aos-delay="300" className="fa-brands fa-bootstrap" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-[2rem_10%]">
            <p data-aos="fade-left" data-aos-duration="500" className="text-[#e6e4e4] font-black pt-[5%] text-[clamp(1.25rem,0.8571rem+1.9643vw,4rem)]">Front-end development</p>
            <p data-aos="fade-left" data-aos-duration="500" className="text-[#7a7a7a] text-[clamp(0.6875rem,0.4643rem+1.1161vw,2.25rem)] font-black">HTML • CSS • JavaScript</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 m-[0_12%_1rem] gap-[8%]">
            <div className="text-[#a19f9f]">
              <div className="mb-1 text-[clamp(0.75rem,0.6107rem+0.6964vw,1.725rem)]" data-aos="fade-left" data-aos-duration="500">HTML</div>
              <div className="p-[0_10px]" data-aos="zoom-in" data-aos-duration="350" data-aos-delay="100">
                <div className="bg-linear-to-b from-[#1b1a1abd] to-[#18171787] backdrop-blur-xl rounded-[clamp(0.5rem,0.1661rem+0.5212vw,1rem)] border border-[#fdfcfc47] p-[clamp(0.4375rem,0.3661rem+0.3571vw,0.9375rem)] mt-[clamp(0.375rem,0.25rem+0.625vw,1.25rem)]">
                  <div className="h-[clamp(0.75rem,0.6143rem+0.6786vw,1.7rem)] w-full overflow-hidden rounded bg-zinc-700/60">
                    <div data-aos="bar-fill" data-aos-duration="1200" data-aos-delay="300" className="h-full rounded bg-zinc-200" style={{ width: "95%" }}/>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[#a19f9f]">
              <div className="mb-1 text-[clamp(0.75rem,0.6107rem+0.6964vw,1.725rem)]" data-aos="fade-left" data-aos-duration="500">CSS</div>
              <div className="p-[0_10px]" data-aos="zoom-in" data-aos-duration="350" data-aos-delay="100">
                <div className="bg-linear-to-b from-[#1b1a1abd] to-[#18171787] backdrop-blur-xl rounded-[clamp(0.5rem,0.1661rem+0.5212vw,1rem)] border border-[#fdfcfc47] p-[clamp(0.4375rem,0.3661rem+0.3571vw,0.9375rem)] mt-[clamp(0.375rem,0.25rem+0.625vw,1.25rem)]">
                  <div className="h-[clamp(0.75rem,0.6143rem+0.6786vw,1.7rem)] w-full overflow-hidden rounded bg-zinc-700/60">
                    <div data-aos="bar-fill" data-aos-duration="1200" data-aos-delay="300" className="h-full rounded bg-zinc-200" style={{ width: "90%" }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[#a19f9f]">
              <div className="mb-1 text-[clamp(0.75rem,0.6107rem+0.6964vw,1.725rem)]" data-aos="fade-left" data-aos-duration="500">JavaScript</div>
              <div className="p-[0_10px]" data-aos="zoom-in" data-aos-duration="350" data-aos-delay="100">
                <div className="bg-linear-to-b from-[#1b1a1abd] to-[#18171787] backdrop-blur-xl rounded-[clamp(0.5rem,0.1661rem+0.5212vw,1rem)] border border-[#fdfcfc47] p-[clamp(0.4375rem,0.3661rem+0.3571vw,0.9375rem)] mt-[clamp(0.375rem,0.25rem+0.625vw,1.25rem)]">
                  <div className="h-[clamp(0.75rem,0.6143rem+0.6786vw,1.7rem)] w-full overflow-hidden rounded bg-zinc-700/60">
                    <div data-aos="bar-fill" data-aos-duration="1200" data-aos-delay="300" className="h-full rounded bg-zinc-200" style={{ width: "55%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-[2rem_10%]">
            <p data-aos="fade-left" data-aos-duration="500" className="text-[#e6e4e4] font-black pt-[5%] text-[clamp(1.25rem,0.8571rem+1.9643vw,4rem)]"> Software Framework </p>
            <p data-aos="fade-left" data-aos-duration="500" className="text-[#7a7a7a] text-[clamp(0.6875rem,0.4643rem+1.1161vw,2.25rem)] font-black">Tailwind CSS • React.js • Node.js • Bootstrap</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 m-[0_12%_4rem] gap-[8%]">
            <div className="text-[#a19f9f]">
              <div className="mb-1 text-[clamp(0.75rem,0.6107rem+0.6964vw,1.725rem)]" data-aos="fade-left" data-aos-duration="500">Tailwind CSS</div>
              <div className="p-[0_10px]" data-aos="zoom-in" data-aos-duration="350" data-aos-delay="100">
                <div className="bg-linear-to-b from-[#1b1a1abd] to-[#18171787] backdrop-blur-xl rounded-[clamp(0.5rem,0.1661rem+0.5212vw,1rem)] border border-[#fdfcfc47] p-[clamp(0.4375rem,0.3661rem+0.3571vw,0.9375rem)] mt-[clamp(0.375rem,0.25rem+0.625vw,1.25rem)]">
                  <div className="h-[clamp(0.75rem,0.6143rem+0.6786vw,1.7rem)] w-full overflow-hidden rounded bg-zinc-700/60">
                    <div data-aos="bar-fill" data-aos-duration="1200" data-aos-delay="300" className="h-full rounded bg-zinc-200" style={{ width: "95%" }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[#a19f9f]">
              <div className="mb-1 text-[clamp(0.75rem,0.6107rem+0.6964vw,1.725rem)]" data-aos="fade-left" data-aos-duration="500"> React.js </div>
              <div className="p-[0_10px]" data-aos="zoom-in" data-aos-duration="350" data-aos-delay="100">
                <div className="bg-linear-to-b from-[#1b1a1abd] to-[#18171787] backdrop-blur-xl rounded-[clamp(0.5rem,0.1661rem+0.5212vw,1rem)] border border-[#fdfcfc47] p-[clamp(0.4375rem,0.3661rem+0.3571vw,0.9375rem)] mt-[clamp(0.375rem,0.25rem+0.625vw,1.25rem)]">
                  <div className="h-[clamp(0.75rem,0.6143rem+0.6786vw,1.7rem)] w-full overflow-hidden rounded bg-zinc-700/60">
                    <div data-aos="bar-fill" data-aos-duration="1200" data-aos-delay="300" className="h-full rounded bg-zinc-200" style={{ width: "60%" }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[#a19f9f]">
              <div className="mb-1 text-[clamp(0.75rem,0.6107rem+0.6964vw,1.725rem)]" data-aos="fade-left" data-aos-duration="500">Node.js</div>
              <div className="p-[0_10px]" data-aos="zoom-in" data-aos-duration="350" data-aos-delay="100">
                <div className="bg-linear-to-b from-[#1b1a1abd] to-[#18171787] backdrop-blur-xl rounded-[clamp(0.5rem,0.1661rem+0.5212vw,1rem)] border border-[#fdfcfc47] p-[clamp(0.4375rem,0.3661rem+0.3571vw,0.9375rem)] mt-[clamp(0.375rem,0.25rem+0.625vw,1.25rem)]">
                  <div className="h-[clamp(0.75rem,0.6143rem+0.6786vw,1.7rem)] w-full overflow-hidden rounded bg-zinc-700/60">
                    <div data-aos="bar-fill" data-aos-duration="1200" data-aos-delay="300" className="h-full rounded bg-zinc-200" style={{ width: "50%" }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[#a19f9f]">
              <div className="mb-1 text-[clamp(0.75rem,0.6107rem+0.6964vw,1.725rem)]" data-aos="fade-left" data-aos-duration="500">Bootstrap</div>
              <div className="p-[0_10px]" data-aos="zoom-in" data-aos-duration="350" data-aos-delay="100">
                <div className="bg-linear-to-b from-[#1b1a1abd] to-[#18171787] backdrop-blur-xl rounded-[clamp(0.5rem,0.1661rem+0.5212vw,1rem)] border border-[#fdfcfc47] p-[clamp(0.4375rem,0.3661rem+0.3571vw,0.9375rem)] mt-[clamp(0.375rem,0.25rem+0.625vw,1.25rem)]">
                  <div className="h-[clamp(0.75rem,0.6143rem+0.6786vw,1.7rem)] w-full overflow-hidden rounded bg-zinc-700/60">
                    <div data-aos="bar-fill" data-aos-duration="1200" data-aos-delay="300" className="h-full rounded bg-zinc-200" style={{ width: "80%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div data-aos="zoom-in" className="p-[clamp(2.5rem,1.6rem+4.5vw,7rem)_7%] relative">
            <hr className="text-[#6d6b6b] font-thin" />
          </div>

          <div className="m-[1rem_7%] grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[2%] auto-rows-fr">
            <div data-aos="zoom-in" data-aos-duration="350" data-aos-delay="0">
              <div className="contents">
                <div className="bg-linear-to-b from-[#1b1a1abd] to-[#18171787] backdrop-blur-xl rounded-[clamp(0.5rem,0.1661rem+0.5212vw,1rem)] h-full flex flex-col border border-[#fdfcfc47] p-[10%]">
                  <i className="fa-solid fa-brush text-[clamp(2.5rem,1.9286rem+2.8571vw,6.5rem)]" />
                  <p className="text-[#e6e4e4] font-black text-[clamp(1.4rem,1.1rem+1.5vw,3.5rem)] pt-[5%] lg:pb-5">UI / UX Web Designer</p>
                  <p className="text-[#7a7a7a] text-[clamp(0.75rem,0.6429rem+0.5357vw,1.5rem)] m-1 grow">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione,minus fugit. Incidunt commodi eos quod a id</p>
                </div>
              </div>
            </div>

            <div data-aos="zoom-in" data-aos-duration="350" data-aos-delay="50">
              <div className="contents">
                <div className="bg-linear-to-b from-[#1b1a1abd] to-[#18171787] backdrop-blur-xl rounded-[clamp(0.5rem,0.1661rem+0.5212vw,1rem)] h-full flex flex-col border border-[#fdfcfc47] p-[10%]">
                  <i className="fa-solid fa-computer text-[clamp(2.5rem,1.9286rem+2.8571vw,6.5rem)]" />
                  <p className="text-[#e6e4e4] font-black text-[clamp(1.4rem,1.1rem+1.5vw,3.5rem)] pt-[5%] lg:pb-5">Front-end Developer</p>
                  <p className="text-[#7a7a7a] text-[clamp(0.75rem,0.6429rem+0.5357vw,1.5rem)] m-1 grow">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione,minus fugit. Incidunt commodi eos quod a id</p>
                </div>
              </div>
            </div>

            <div data-aos="zoom-in" data-aos-duration="350" data-aos-delay="150">
              <div className="contents">
                <div className="bg-linear-to-b from-[#1b1a1abd] to-[#18171787] backdrop-blur-xl rounded-[clamp(0.5rem,0.1661rem+0.5212vw,1rem)] h-full flex flex-col border border-[#fdfcfc47] p-[10%]">
                  <i className="fa-solid fa-tablet-screen-button text-[clamp(2.5rem,1.9286rem+2.8571vw,6.5rem)]" />
                  <p className="text-[#e6e4e4] font-black text-[clamp(1.4rem,1.1rem+1.5vw,3.5rem)] pt-[5%] lg:pb-5">Responsive Performance</p>
                  <p className="text-[#7a7a7a] text-[clamp(0.75rem,0.6429rem+0.5357vw,1.5rem)] m-1 grow">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione,minus fugit. Incidunt commodi eos quod a id</p>
                </div>
              </div>
            </div>

            <div data-aos="zoom-in" data-aos-duration="350" data-aos-delay="200">
              <div className="contents">
                <div className="bg-linear-to-b from-[#1b1a1abd] to-[#18171787] backdrop-blur-xl rounded-[clamp(0.5rem,0.1661rem+0.5212vw,1rem)] h-full flex flex-col border border-[#fdfcfc47] p-[10%]">
                  <i className="fa-solid fa-code-branch text-[clamp(2.5rem,1.9286rem+2.8571vw,6.5rem)]" />
                  <p className="text-[#e6e4e4] font-black text-[clamp(1.4rem,1.1rem+1.5vw,3.5rem)] pt-[5%] lg:pb-5">Version Control</p>
                  <p className="text-[#7a7a7a] text-[clamp(0.75rem,0.6429rem+0.5357vw,1.5rem)] m-1 grow">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione,minus fugit. Incidunt commodi eos quod a id</p>
                </div>
              </div>
            </div>
          </div>
          
          <div data-aos="zoom-in" className="p-[clamp(2.5rem,1.6rem+4.5vw,7rem)_7%]">
            <hr className="text-[#454444] font-thin" />
          </div>
        </div>
      </section>

      <section id="projects" className="w-full">
        <div className="relative w-full">

          <div className="p-[7%_8.5%_7%] relative border-y-[clamp(0.0625rem,0.0536rem+0.0446vw,0.125rem)] border-[#fdfcfc43]">
            <img src="/src/img/banner.jpg" alt="" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-75s" />

            <div className="absolute inset-0 -z-10 bg-linear-to-l from-[#111111]/50 to-[#111111dc] to-25%" />

            <div className="relative">
              <p data-aos="fade-left" data-aos-duration="500" className="text-[clamp(1.8125rem,0.9286rem+4.4196vw,8rem)] font-black">Projects & Works</p>
              <p data-aos="fade-left" data-aos-duration="500" className="text-[clamp(0.6875rem,0.4643rem+1.1161vw,2.25rem)] text-[#A2A1A1] pt-3">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsacupiditate impedit corrupti dolorum repudiandae dignissimos repellat.Ratione quam, quae incidunt aut vero sapiente illum, laudantium minimaipsam praesentium provident fuga!</p>
            </div>
          </div>

          <div className="bg-radial-[at_100%_0%] bg-[#1c1c1c] from-[#161616] to-[#100f0f] to-100% relative">
            <div data-aos="zoom-in" className="p-[clamp(2.5rem,1.6rem+4.5vw,7rem)_7%]">
              <hr className="text-[#454444] font-thin" />
            </div>

            <div className="p-[0_9%]">
              <div className="w-full">
                <p data-aos="fade-up" data-aos-duration="500" className="font-black text-[clamp(1.5rem,0.8571rem+3.2143vw,6rem)]  leading-tight">Ecoscapes</p>
                <div data-aos="fade-up" data-aos-duration="500" className="text-[clamp(0.625rem,0.4429rem+0.9107vw,1.9rem)] text-[#d5d3d3] p-[0.75rem_1%_0]">
                  <ul className="flex flex-wrap gap-1.5 pt-[0.2rem] list-none">
                    <li data-aos="zoom-in" data-aos-duration="500" data-aos-delay="0" className="rounded-md backdrop-blur-[3px] border border-solid border-[#fdfcfc47] bg-linear-to-b from-[#1b1a1abd] to-[#18171787] p-[4px_6px]">HTML</li>
                    <li data-aos="zoom-in" data-aos-duration="500" data-aos-delay="50" className="rounded-md backdrop-blur-[3px] border border-solid border-[#fdfcfc47] bg-linear-to-b from-[#1b1a1abd] to-[#18171787] p-[4px_6px]">CSS</li>
                    <li data-aos="zoom-in" data-aos-duration="500" data-aos-delay="100" className="rounded-md backdrop-blur-[3px] border border-solid border-[#fdfcfc47] bg-linear-to-b from-[#1b1a1abd] to-[#18171787] p-[4px_6px]">JavaScript</li>
                  </ul>
                </div>

                <p data-aos="fade-up" data-aos-duration="500" className="text-[#9b9a9a] text-[clamp(0.6875rem,0.4643rem+1.1161vw,2.25rem)] p-[1rem_4%_clamp(1rem,2vw,2rem)_4%]"> Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio eligendi corrupti veritatis sequi sit eos ipsam? Quaerat eligendi ipsum fuga possimus architecto omnis dolores, iusto nemo perferendis neque? Cum dicta cumque consequuntur sequi incidunt mollitia delectus necessitatibus aliquid, aut voluptatibus!</p>

                <div data-aos="fade-up" data-aos-duration="500" data-gallery="" className="w-full backdrop-blur-[3px] border border-solid border-[#fdfcfc47] bg-linear-to-b from-[#1b1a1abd] to-[#18171787] rounded-sm p-[clamp(0.375rem,0.1rem+1.4vw,1.25rem)]">
                  <div className="flex flex-wrap items-center justify-between gap-[clamp(0.375rem,0.1rem+1vw,1rem)]">
                    <button type="button" data-prev="" aria-label="Previous image" className="hidden md:flex order-2 sm:order-1 btn btn-circle shrink-0 min-h-0 p-0 h-[clamp(1.75rem,1.2rem+2.2vw,3.5rem)] w-[clamp(1.75rem,1.2rem+2.2vw,3.5rem)] text-[clamp(0.75rem,0.5rem+1vw,1.5rem)] backdrop-blur-md border border-white/40 bg-linear-to-b from-[#22222274] to-[#17171781] text-white hover:border-white hover:scale-105 transition-all" >❮</button>

                    <div data-track="" tabIndex={0} aria-label="Ecoscapes screenshots" className="order-1 sm:order-2 carousel w-full sm:w-auto sm:flex-1 min-w-0 overflow-x-auto overscroll-x-contain rounded-sm focus-visible:outline-2 focus-visible:outline-white" >
                      <div className="carousel-item w-full">
                        <img src="./src/img/Ecoscapes1.png" alt="Ecoscapes slide 1" width={1920} height={1080} className="w-full h-auto object-cover aspect-video" />
                      </div>

                      <div className="carousel-item w-full">
                        <img src="./src/img/Ecoscapes2.png" alt="Ecoscapes slide 2" width={1920} height={1080} loading="lazy" className="w-full h-auto object-cover aspect-video" />
                      </div>

                      <div className="carousel-item w-full">
                        <img src="./src/img/Ecoscapes3.png" alt="Ecoscapes slide 3" width={1920} height={1080} loading="lazy" className="w-full h-auto object-cover aspect-video" />
                      </div>

                      <div className="carousel-item w-full">
                        <img src="./src/img/Ecoscapes4.png" alt="Ecoscapes slide 4" width={1920} height={1080} loading="lazy" className="w-full h-auto object-cover aspect-video" />
                      </div>

                      <div className="carousel-item w-full">
                        <img src="./src/img/Ecoscapes5.png" alt="Ecoscapes slide 5" width={1920} height={1080} loading="lazy" className="w-full h-auto object-cover aspect-video" />
                      </div>

                      <div className="carousel-item w-full">
                        <img src="./src/img/Ecoscapes6.png" alt="Ecoscapes slide 6" width={1920} height={1080} loading="lazy" className="w-full h-auto object-cover aspect-video" />
                      </div>
                    </div>
                    <button type="button" data-next="" aria-label="Next image" className="hidden md:flex order-3 shrink-0 btn btn-circle min-h-0 p-0 h-[clamp(1.75rem,1.2rem+2.2vw,3.5rem)] w-[clamp(1.75rem,1.2rem+2.2vw,3.5rem)] text-[clamp(0.75rem,0.5rem+1vw,1.5rem)] backdrop-blur-md border border-white/40 bg-linear-to-b from-[#22222274] to-[#17171781] text-white hover:border-white hover:scale-105 transition-all">❯</button>
                  </div>

                  <p data-counter="" aria-live="polite" className="hidden md:block text-right text-[#9b9a9a] text-[clamp(0.625rem,0.4429rem+0.9107vw,1.9rem)] pt-2">1 / 6</p>
                  <div data-thumbs="" className="mt-2 flex gap-[clamp(0.25rem,0.1rem+0.6vw,0.75rem)] overflow-x-auto pb-1 scrollbar-thin" >
                    <a href="#" data-thumb="" aria-label="Show image 1" className="shrink-0 w-[clamp(7rem,4.4286rem+12.8571vw,25rem)] h-auto aspect-video overflow-hidden border border-white/20 opacity-70 hover:opacity-100 hover:border-white/60 aria-current:opacity-100 aria-current:border-white transition-all focus:outline-none focus:ring-2 focus:ring-white" >
                      <img src="./src/img/Ecoscapes1.png" alt="Thumbnail 1" loading="lazy" className="w-full object-cover" />
                    </a>

                    <a href="#" data-thumb="" aria-label="Show image 2" className="shrink-0 w-[clamp(7rem,4.4286rem+12.8571vw,25rem)] h-auto aspect-video overflow-hidden border border-white/20 opacity-70 hover:opacity-100 hover:border-white/60 aria-current:opacity-100 aria-current:border-white transition-all focus:outline-none focus:ring-2 focus:ring-white" >
                      <img src="./src/img/Ecoscapes2.png" alt="Thumbnail 2" loading="lazy" className="w-full object-cover" />
                    </a>

                    <a href="#" data-thumb="" aria-label="Show image 3" className="shrink-0 w-[clamp(7rem,4.4286rem+12.8571vw,25rem)] h-auto aspect-video overflow-hidden border border-white/20 opacity-70 hover:opacity-100 hover:border-white/60 aria-current:opacity-100 aria-current:border-white transition-all focus:outline-none focus:ring-2 focus:ring-white" >
                      <img src="./src/img/Ecoscapes3.png" alt="Thumbnail 3" loading="lazy" className="w-full object-cover" />
                    </a>

                    <a href="#" data-thumb="" aria-label="Show image 4" className="shrink-0 w-[clamp(7rem,4.4286rem+12.8571vw,25rem)] h-auto aspect-video overflow-hidden border border-white/20 opacity-70 hover:opacity-100 hover:border-white/60 aria-current:opacity-100 aria-current:border-white transition-all focus:outline-none focus:ring-2 focus:ring-white" >
                      <img src="./src/img/Ecoscapes4.png" alt="Thumbnail 4" loading="lazy" className="w-full object-cover" />
                    </a>

                    <a href="#" data-thumb="" aria-label="Show image 5" className="shrink-0 w-[clamp(7rem,4.4286rem+12.8571vw,25rem)] h-auto aspect-video overflow-hidden border border-white/20 opacity-70 hover:opacity-100 hover:border-white/60 aria-current:opacity-100 aria-current:border-white transition-all focus:outline-none focus:ring-2 focus:ring-white" >
                      <img src="./src/img/Ecoscapes5.png" alt="Thumbnail 5" loading="lazy" className="w-full object-cover" />
                    </a>

                    <a href="#" data-thumb="" aria-label="Show image 6" className="shrink-0 w-[clamp(7rem,4.4286rem+12.8571vw,25rem)] h-auto aspect-video overflow-hidden border border-white/20 opacity-70 hover:opacity-100 hover:border-white/60 aria-current:opacity-100 aria-current:border-white transition-all focus:outline-none focus:ring-2 focus:ring-white" >
                      <img src="./src/img/Ecoscapes6.png" alt="Thumbnail 6" loading="lazy" className="w-full object-cover" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="w-full">
                <p data-aos="fade-up" data-aos-duration="500" className="text-[#e6e4e4] font-black pt-[5%] text-[clamp(1.5rem,0.8571rem+3.2143vw,6rem)]  leading-tight">Other design works</p>
                <p data-aos="fade-up" data-aos-duration="500" className="text-[#9b9a9a] text-[clamp(0.6875rem,0.4643rem+1.1161vw,2.25rem)] p-[1rem_4%_clamp(1rem,2vw,2rem)_4%]">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugit asperiores labore error at ut quia! Aspernatur pariatur nulla quas voluptas.</p>
                <div data-aos="fade-up" data-aos-duration="500" data-gallery="" className="w-full mt-[1.2rem] backdrop-blur-[3px] border border-solid border-[#fdfcfc47] bg-linear-to-b from-[#1b1a1abd] to-[#18171787] rounded-sm p-[clamp(0.375rem,0.1rem+1.4vw,1.25rem)]" >
                  <div className="flex flex-wrap items-center justify-between gap-[clamp(0.375rem,0.1rem+1vw,1rem)]">
                    <button type="button" data-prev="" aria-label="Previous image" className="hidden md:flex order-2 sm:order-1 btn btn-circle shrink-0 min-h-0 p-0 h-[clamp(1.75rem,1.2rem+2.2vw,3.5rem)] w-[clamp(1.75rem,1.2rem+2.2vw,3.5rem)] text-[clamp(0.75rem,0.5rem+1vw,1.5rem)] backdrop-blur-md border border-white/40 bg-linear-to-b from-[#22222274] to-[#17171781] text-white hover:border-white hover:scale-105 transition-all">❮</button>

                    <div data-track="" tabIndex={0} aria-label="Other design works" className="order-1 sm:order-2 carousel w-full sm:w-auto sm:flex-1 min-w-0 overflow-x-auto overscroll-x-contain rounded-sm focus-visible:outline-2 focus-visible:outline-white">
                      <div className="carousel-item w-full">
                        <img src="./src/img/other1.png" alt="Other design work 1" width={1920} height={1080} loading="lazy" className="w-full h-auto object-cover aspect-video" />
                      </div>

                      <div className="carousel-item w-full">
                        <img src="./src/img/other2.png" alt="Other design work 2" width={1920} height={1080} loading="lazy" className="w-full h-auto object-cover aspect-video" />
                      </div>
                    </div>

                    <button type="button" data-next="" aria-label="Next image" className="hidden md:flex order-3 shrink-0 btn btn-circle min-h-0 p-0 h-[clamp(1.75rem,1.2rem+2.2vw,3.5rem)] w-[clamp(1.75rem,1.2rem+2.2vw,3.5rem)] text-[clamp(0.75rem,0.5rem+1vw,1.5rem)] backdrop-blur-md border border-white/40 bg-linear-to-b from-[#22222274] to-[#17171781] text-white hover:border-white hover:scale-105 transition-all" >❯</button>
                  </div>

                  <p data-counter="" aria-live="polite" className="hidden md:block text-right text-[#9b9a9a] text-[clamp(0.625rem,0.4429rem+0.9107vw,1.9rem)] pt-2" > 1 / 2 </p>

                  <div data-thumbs="" className="mt-2 flex gap-[clamp(0.25rem,0.1rem+0.6vw,0.75rem)] overflow-x-auto pb-1 scrollbar-thin" >
                    <a href="#" data-thumb="" aria-label="Show image 1" className="shrink-0 w-[clamp(7rem,4.4286rem+12.8571vw,25rem)] h-auto aspect-video overflow-hidden border border-white/20 opacity-70 hover:opacity-100 hover:border-white/60 aria-current:opacity-100 aria-current:border-white transition-all focus:outline-none focus:ring-2 focus:ring-white">
                      <img src="./src/img/other1.png" alt="Thumbnail 1" loading="lazy" className="w-full object-cover" />
                    </a>

                    <a href="#" data-thumb="" aria-label="Show image 2" className="shrink-0 w-[clamp(7rem,4.4286rem+12.8571vw,25rem)] h-auto aspect-video overflow-hidden border border-white/20 opacity-70 hover:opacity-100 hover:border-white/60 aria-current:opacity-100 aria-current:border-white transition-all focus:outline-none focus:ring-2 focus:ring-white" >
                      <img src="./src/img/other2.png" alt="Thumbnail 2" loading="lazy" className="w-full object-cover"/>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div data-aos="zoom-in" className="p-[clamp(2.5rem,1.6rem+4.5vw,7rem)_7%]">
              <hr className="text-[#454444] font-thin" />
            </div>
          </div>
        </div>
      </section>

      <footer
        className="footer p-[clamp(2rem,1.3571rem+3.2143vw,6.5rem)] bg-linear-to-b from-[#1a1a1a82] to-[#0f0f0f70] backdrop-blur-md border-t border-[#fdfcfc47] grid grid-cols-1 sm:grid-cols-2 sm:gap-[10%] text-[#cbcaca]"
        id="contacts"
      >
        <div className="flex flex-col justify-between space-y-[clamp(1rem,0.7143rem+1.4286vw,3rem)]">
          <div data-aos="fade-left" data-aos-duration="500" className="flex items-start">
            <i className="fa-solid fa-location-dot text-[clamp(1.5rem,1rem+2.5vw,5rem)] text-[#fdfcfc] mt-1 shrink-0" />
            <div className="text-[clamp(0.75rem,0.6179rem+0.6607vw,1.675rem)] pl-4 leading-relaxed ">
              <p>367 Doña Donisia, Bayan Luma II</p>
              <p>Imus City, Cavite, Philippines</p>
            </div>
          </div>

          <div data-aos="fade-left" data-aos-duration="500" lassName="flex items-center">
            <i className="fa-solid fa-phone text-[clamp(1.5rem,1rem+2.5vw,5rem)] text-[#fdfcfc] shrink-0" />
            <a href="tel:+639605599276" className="text-[clamp(0.75rem,0.6179rem+0.6607vw,1.675rem)] pl-4 hover:text-white transition-colors" >+63 960 559 9276</a>
          </div>

          <div data-aos="fade-left" data-aos-duration="500" className="flex items-start">
            <i className="fa-solid fa-envelope text-[clamp(1.5rem,1rem+2.5vw,5rem)] text-[#fdfcfc] mt-1 shrink-0" />
            <div className="text-[clamp(0.75rem,0.6179rem+0.6607vw,1.675rem)] pl-4 leading-relaxed">
              <p><a href="mailto:combesxyrill@gmail.com" className="hover:text-white transition-colors" >combesxyrill@gmail.com</a></p>
              <p><a href="mailto:xyrilladrienne.combes@cvsu.edu.ph" className="hover:text-white transition-colors" >xyrilladrienne.combes@cvsu.edu.ph</a></p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between text-center sm:text-left">
          <div data-aos="fade-up" data-aos-duration="500">
            <p className="text-[clamp(1.25rem,0.8571rem+1.9643vw,4rem)] font-black text-white tracking-wide">Social Media</p>
            <p className="text-[clamp(0.75rem,0.6179rem+0.6607vw,1.675rem)] text-[#a4a2a2] leading-relaxed p-[clamp(0.5rem,0.1429rem+1.7857vw,3rem)_0.25rem]">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Neque vitaeipsum iure repellendus aspernatur!</p>
          </div>

          <div data-aos="fade-up" data-aos-duration="500" data-aos-delay="25" className="flex w-full items-center justify-center sm:justify-start gap-4 text-[clamp(1.5rem,0.8571rem+3.2143vw,6rem)] text-[#faf9f9] text-center sm:text-left">
            <a data-aos="zoom-in" data-aos-duration="500" data-aos-delay="0" href="https://www.facebook.com/xyrilladrienne.combes/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-white transition-colors" ><i className="fa-brands fa-square-facebook" /></a>
            <a data-aos="zoom-in" data-aos-duration="500" data-aos-delay="50" href="https://ph.pinterest.com/ValkyrieMaster/_profile/" target="_blank" rel="noopener noreferrer" aria-label="Pinterest" className="hover:text-white transition-colors" ><i className="fa-brands fa-square-pinterest" /></a>
            <a data-aos="zoom-in" data-aos-duration="500" data-aos-delay="100" href="https://github.com/Adrienne-2005" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-white transition-colors" > <i className="fa-brands fa-square-github" /> </a>
            <a data-aos="zoom-in" data-aos-duration="500" data-aos-delay="150" href="https://reddit.com" target="_blank" rel="noopener noreferrer" aria-label="Reddit" className="hover:text-white transition-colors" ><i className="fa-brands fa-square-reddit" /></a>
          </div>
        </div>
      </footer>
    </>


  )
}

export default App
