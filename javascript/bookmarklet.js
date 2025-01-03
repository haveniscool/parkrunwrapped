const test = t => t ?? null;

function getData() {
  const parkrunIDs = {
    "parkrun ID": ["com.au", "co.at", "ca" ,"co.za", "com.de", "ie", "my", "co.nz", "sg", "se", "org.uk", "us"],
    "Løber ID": ["dk"], "Athlete ID": ["fi"], "ID participant": ["fr"], "Codice identificativo atleta": ["it"],
    "parkrunID": ["jp"], "Sportininko ID": ["lt"], "parkrun-nummer": ["co.nl"], "Utøver-ID": ["no"], "Numer uczestnika": ["pl"]
  };
if (false){
let parkrunIDName = Object.keys(parkrunIDs).find(id =>
  parkrunIDs[id].some(domain => window.location.host === `www.parkrun.${domain}`)) || error("001");} else {parkrunIDName = "parkrun ID"}
let nameelement = document.querySelector(`span[title="${parkrunIDName}"]`) ||
  Object.keys(parkrunIDs).map(id => document.querySelector(`span[title="${id}"]`)).find(Boolean) || error("002");

let id = nameelement.innerText;
let name = nameelement.parentElement.cloneNode(true);
name.querySelector(`span[title="${parkrunIDName}"]`)?.remove();
name = name.innerText.trim().toUpperCase();

  let results = [...document.querySelectorAll("#results tbody tr")].map(r => {
    const cells = r.querySelectorAll("td");
    if (cells.length < 7) return null;
    const [d, m, y] = cells[1].innerText.split("/").map(Number);
    const [h = 0, mi = 0, s = 0] = cells[4].innerText.split(":").map(Number);
    return {
      event: cells[0].innerText.trim(), date: new Date(y, m - 1, d),
      runnum: +cells[2].innerText, pos: +cells[3].innerText,
      time: { hours: h, minutes: mi, seconds: s },
      ageGrade: +cells[5].innerText.replace("%", ""), PB: cells[6].innerText === "PB"
    };
  }).filter(Boolean);

  if (!results.length) error("003");

  let badges = [...document.querySelectorAll(".Vanity-page--clubIcon")]
    .flatMap(b => [...b.classList])
    .filter(cls => cls.startsWith("milestone-v"))
    .map(cls => cls.replace("milestone-v", ""))
		.map(badge => badge + "v")
    .filter(b => ["10v", "25v", "50v", "100v", "250v", "500v", "1000v"].includes(String(b)))

  return { 
    id, 
    name, 
    results: results.length ? results : null, 
    badges: { volunteering: badges.length ? badges : null } 
  };
}

function error(code, message = "") {
  console.log(`${code}: ${{"001": "Wrong URL Base", "002": "No id element", "003": "No results"}[code] || "Unknown Error"} ${message}`.trim());
  return "";
}

function createPreferencesPopup(years) {
  return new Promise((resolve) => {
    const popup = document.createElement("div");
    popup.style = `font-family: Gabarito; position: fixed; top: 50%; left: 50%; 
transform: translate(-50%, -50%); background: #fff; padding: 20px;
border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, .2); z-index: 9999;
width: 80%; max-width: 400px; max-height: 80vh; overflow-y: auto;`;
    const form = document.createElement("form");
    form.style = "max-height: calc(80vh - 80px); overflow-y: auto;";
    const currentYear = new Date().getFullYear();
    let preferences = { year: "all", unit: 0, watermark: { name: true, ids: false } };

    form.innerHTML = `<label>Create Parkrun Wrapped for:
  <select id="yearSelect" style="border: 2px solid #E6224B; border-radius: 3px;">
    ${years.filter(y => y >= 2004 && y <= currentYear).map(y =>
      `<option value="${y}" ${preferences.year === y ? "selected" : ""}>${y}</option>`
    ).join("")}
    <option value="all" ${preferences.year === "all" ? "selected" : ""}>All Time</option>
  </select>
</label><div style="font-size: 10px">* Volunteer badges are excluded for non-All Time years.</div><br>
<label>Unit: 
  <select id="unitSelect" style="border: 2px solid #E6224B; border-radius: 3px;">
    <option value="0" ${preferences.unit === 0 ? "selected" : ""}>Kilometers</option>
    <option value="1" ${preferences.unit === 1 ? "selected" : ""}>Miles</option>
  </select>
</label><br><br>
<label>Watermark: <br>
  <label style="font-size: 12px">Name: <input type="checkbox" id="NAMECHECK" ${preferences.watermark.name ? "checked" : ""}></label><br>
  <label style="font-size: 12px">Id: <input type="checkbox" id="IDCHECK" ${preferences.watermark.ids ? "checked" : ""}></label><br><br>
</label>`

    const submit = document.createElement("button");
    submit.textContent = "Create your wrapped";
    submit.type = "button";
    submit.style = "background-color: #E6224B; color: #fff; border: 1px solid rgb(43, 44, 46); border-radius: 3px";
    submit.onclick = () => {
      const yearSelect = form.querySelector("#yearSelect");
      const unitSelect = form.querySelector("#unitSelect");
      const checkboxes = form.querySelectorAll('input[type="checkbox"]');
      preferences = {
        year: yearSelect.value === "all" ? 0 : +yearSelect.value,
        unit: +unitSelect.value,
        watermark: { name: checkboxes[0].checked, ids: checkboxes[1].checked },
      };
      resolve(preferences);
      popup.remove();
    };

    popup.append(form, submit);
    document.body.appendChild(popup);
  });
}

const userresults = getData()
const yearsWithParkruns = [...new Set(userresults.results.map(r => r.date.getFullYear()))];

createPreferencesPopup(yearsWithParkruns)
  .then((preferences) => {
    const yearresults =
      preferences.year == 0
        ? userresults.results
        : userresults.results.filter(
            (result) => result.date.getFullYear() === preferences.year,
          )

    // functions
    const getRandomTimeComparison = (timeInMinutes) => {
      const times = [
        {"you could've binged every season of Friends": 5321},
        {"you could've watched the marathon world record": 121.65},
        {"you could've binged Game of Thrones": 3952.3},
        {"you could've watched the full Star Wars saga": 1617},
        {"you could've completed the entire Lord of the Rings trilogy": 683},
        {"the ISS orbited the earth": 90},
        {"the Apollo 11 could've flown to the moon and back": 11719},
        {"you could've brushed your teeth": 2},
        {"you played the shortest possible game of chess": .25},
        {"you could've watched the longest game of professional American football": 4960},
        {"you could've played a game of football": 90 },
        {"you could've watched Barbie (2024) and Oppenheimer": 294.15},
        {"you could've watched The Muppet Movie": 97 }
      ]
      return "In that time " + times
        .map((item) => {
          const [text, value] = Object.entries(item)[0]
          return { text, value: Math.round(timeInMinutes / value) }
        })
        .filter(({ value }) => value > 1)
        .map(({ text, value }) => `${text} ${value} times`)
        .at(Math.floor(Math.random() * times.length))
    }
    
    
    const plural = (num, caps = false) => (num === 1 ? "" : caps ? "S" : "s")
    const calctotalminutes = (h = 0, m = 0, s = 0) => h * 60 + m + s / 60
    const getOneKey = (params, key) => params.map((e) => e[key])
    const sumofarray = (arr) => arr.reduce((a, v) => a + v, 0)
    const mode = (arr) =>
      arr.reduce((a, b) =>
        arr.filter((v) => v === a).length >= arr.filter((v) => v === b).length
          ? a
          : b,
      )
    const highestRole = (roles) =>
      roles.reduce((max, role) => (role.role > max.role ? role : max)).name
    const getDistanceComparison = (distance) => {
      let comparison = {
        height: {
          "the Eiffel Tower": .3300984,
          "the Statue of Liberty": .04605,
          "the Great Pyramid of Giza": .137,
          "the Empire State Building": .38,
          "the Burj Khalifa": .828,
          "Mount Everest": 8.849,
          "the One World Trade Center": .5413248,
          "Big Ben": .096,
          "Taipei 101": .509,
          "the CN Tower": .5533,
          "the Chichen Itza Pyramid": .03,
          "the Leaning Tower of Pisa (Without the Slant)": .05836,
          "the Acropolis": .156,
          "the Shard": .3096,
          "Tokyo Tower": .333,
          "Willis Tower": .442,
          "the Petronas Towers": .452,
          "Neuschwanstein Castle": .065,
          "Mont Blanc": 4.80559,
          "Mount Fuji": 3.776,
          "the Burj Al Arab": .321,
          "Sagrada Familia": .1725,
          "Mount Kilimanjaro": 5.895,
          "Vatican St. Peter’s Dome": .13657,
          "the Chrysler Building": .319,
          "St. Basil’s Cathedral": .0475,
          "the Tokyo Skytree": .634,
          "Mount St. Helens": 2.549,
          "Mount Elbrus": 5.641848,
          "the Sydney Tower Eye": .268,
          "the Palace of Westminster": .0985,
          "the Hyperion Tree": .11555,
        },
        length: {
          "the Golden Gate Bridge": 2.737,
          "the Sydney Harbour Bridge": 1.149096,
          "the Great Wall of China": 21196.67,
          "the Amazon River": 6400.361,
          "the Colorado River": 2333.549,
        },
        perimeter: {
          "the Colosseum": .545,
        },
        circumference: {
          "the Earth": 40074.275,
          "Jupiter": 439264.007,
        },
        depth: {
          "the Mariana Trench": 10.984,
          "Lake Baikal": 1.642,
        },
        distance: {
          "the Earth to the Moon": 384400,
          "New York to Los Angeles": 4488.62135,
        },
      }

      const getAmountComparison = (a, b) => (a > b ? a / b : b / a)
      const allEntries = Object.entries(comparison).flatMap(([cat, items]) =>
        Object.entries(items).map(([name, value]) => ({
          category: cat,
          name,
          value,
        })),
      )
      const { category, name, value } =
        allEntries[Math.floor(Math.random() * allEntries.length)]
      return `that's ${getAmountComparison(distance, value).toFixed(2)} times the ${category}${category === "distance" ? " from " : " of "}${name}`
    }
    
    const multiplier = preferences.unit === 0 ? 5 : 3.10686

    const totalMinutesArray =
      test(
        yearresults.map((eventObj) =>
          calctotalminutes(
            eventObj.time.hours,
            eventObj.time.minutes,
            eventObj.time.seconds,
          ),
        ),
      ) || []
    const fastestTotalMinutes = test(Math.min(...totalMinutesArray)) || 0
    const fastestEvent =
      test(
        yearresults.find(
          (eventObj) =>
            calctotalminutes(
              eventObj.time.hours,
              eventObj.time.minutes,
              eventObj.time.seconds,
            ) === fastestTotalMinutes,
        ),
      ) || 0

    // Extract event times (hours, minutes, seconds)
    const timesArray = test(yearresults.map((result) => result.time)) || []
    const hoursArray = test(timesArray.map(({ hours }) => hours)) || []
    const minutesArray = test(timesArray.map(({ minutes }) => minutes)) || []
    const secondsArray = test(timesArray.map(({ seconds }) => seconds)) || []

    const agegrades = test(yearresults.map((result) => result.ageGrade)) || []

    // Simplified badge retrieval
    const getBadge = (index, badge) =>
      userresults.results[index] &&
      (preferences.year === 0 ||
        userresults.results[index].date.getFullYear() === preferences.year)
        ? badge
        : ""

    // Running badges
    const runningBadges =
      test(
        [9, 24, 49, 99, 249, 499, 999]
          .map((index) => getBadge(index, `${index + 1}r`))
          .filter(Boolean),
      ) || []

    // Parkrun stats
    const parkrunsattended = test(yearresults.length) || 0
    const locationsattended =
      test(new Set(getOneKey(yearresults, "event")).size) || []
    const topparkrun = test(mode(getOneKey(yearresults, "event"))) || ""
    const topparkrunattendance =
      test(
        yearresults.filter((eventObj) => eventObj.event === topparkrun).length,
      ) || 0

    const fastestagegrade = test(Math.max(...agegrades)) || 0
    const avgagegrade =
      test(
        Math.round(
          agegrades.reduce((acc, num) => acc + num, 0) / agegrades.length,
        ),
      ) || 0

    const totalminutes =
      test(
        Math.round(
          sumofarray(
            hoursArray.map((hours, index) =>
              calctotalminutes(hours, minutesArray[index], secondsArray[index]),
            ),
          ),
        ),
      ) || 0

    let comparison = test(getRandomTimeComparison(totalminutes)) || ""

    const { event: fastestparkrunlocation = "", date: fastestEventDate } =
      fastestEvent || {}
    const [fastesthour, fastestminute, fastestsecond] =
      test([
        Math.floor(fastestTotalMinutes / 60),
        Math.floor(fastestTotalMinutes % 60),
        Math.round((fastestTotalMinutes % 1) * 60),
      ]) || []

    const fastestparkrundate =
      test(
        fastestEventDate ? fastestEventDate.toLocaleDateString("en-US") : "",
      ) || ""

    // Distance and badge list
    const totaldistance = test(Math.round(yearresults.length * multiplier)) || 0
    const distancecomparison = test(getDistanceComparison(totaldistance)) || ""
    const badges = test(
      preferences.year === 0
        ? [
            ...runningBadges.map((badge) => badge),
            ...userresults.badges.volunteering.map((badge) => badge),
          ]
        : runningBadges.map((badge) => badge),
    )

    let widthelement = 1079 * 1.5
    let heightelement = 1423.5 * 1.5
    const divstyle = `max-width: ${widthelement}px; position: absolute; min-width: ${widthelement}px; min-height: ${heightelement}px; max-height: ${heightelement}px; align-items: center; text-align: center; padding-left: 82px; padding-right: 82px; font-family: Gabarito; color: #fff;`
    const flexcolstyle =
      "display: flex; flex-direction: column; justify-content: center;"
    const font36style = `text-align: left; font-size: 36px;`
    const bigletterstyle =
      "font-family: Bernoru; font-size: 202px; font-weight: 900;"
    const smallletterstyle = "font-size: 73px;"

    let minutes = `<div style="${divstyle} ${flexcolstyle}  row-gap: 208px; background-color: #FFA300; font-size: 73px;">
              <div style="${flexcolstyle} align-items: center; text-align: center; row-gap: 18px">
                  <div style="${smallletterstyle}">YOU SPENT A TOTAL OF</div>
                  <div style="${bigletterstyle}">${totalminutes}</div>
                  <div style="${smallletterstyle}">MINUTE${plural(totalminutes, true)} PARKRUNNING</div>
              </div>
              <div style="font-size: 73px; letter-spacing: -1.25px">${comparison}</div>
          </div>`
    if (totalminutes == 0 || comparison == "") {
      minutes = ""
    }

    let fastest = ([fastesthour, fastestminute, fastestsecond] == [] ||
      [fastesthour, fastestminute, fastestsecond] == [0, 0, 0]) ? "" : `<div id="fastest" style="${divstyle} ${flexcolstyle} row-gap: 108px; background-color: #2B2C2E; font-size: 73px;">
              <div style="font-size: 73px;">${preferences.year == 0 ? "You've" : "This year you've"} completed your fastest Parkrun in</div>
              
              <div style=" font-size: 202px; font-weight: 900; color: #FFA300">${fastesthour} hour${plural(fastesthour)}, ${fastestminute} minute${plural(fastestminute)}, and ${fastestsecond} second${plural(fastestsecond)}</div>
              <div style="font-size: 73px;">On ${fastestparkrundate} at ${fastestparkrunlocation}</div>
          </div>`

    let agegrade = (fastestagegrade == 0 || avgagegrade == 0) ? "" : `<div style="${divstyle} ${flexcolstyle} row-gap: 108px; background-color: #75A42E; font-size: 80px;">
                  <div style="${smallletterstyle}">Your fastest age grade was</div>
                  <div style="color: #E4E643; ${bigletterstyle}">${fastestagegrade}%</div>
                  
                  <div style="${smallletterstyle}">Your average age grade was <span style="font-weight: 900; color: #E4E643">${avgagegrade}%</span></div>
                  
          </div>`

    let distance = (distancecomparison == "" || totaldistance == 0) ? "" : `<div style="${divstyle} ${flexcolstyle} row-gap: 138px; background-color: #E6224B;">
                  <div style="${smallletterstyle}">${preferences.year == 0 ? "Throughout the years you've been on a journey" : "This year took you on a journey."}</div>
                  <div style=" font-size: 202px; font-weight: 900;">You traveled a total of  <span style="style="color: #E4E643">${totaldistance} ${preferences.unit == 0 ? "Kilometers" : "Miles"}</span></div>
                  <div style="${smallletterstyle}>That's <span style="font-weight: 900; color: #E4E643">${distancecomparison}</span></div>
          </div>`
          

    let parkruns = (locationsattended == 0|| parkrunsattended == 0 || topparkrun == "" || topparkrunattendance == "") ? "" : `<div id="parkruns" style="${divstyle} ${flexcolstyle} row-gap: 138px; background-color: #2B2C2E; font-size: 103px;">
              <div style="${flexcolstyle} align-items: center;">
                  <div>You attended <span style="color: #EA0B86;; font-weight: 900;">${parkrunsattended}</span></div>
                  <div>Parkrun${plural(parkrunsattended)} At</div>
                  <div><span style="color: #EA0B86; font-weight: 900;">${locationsattended}</span> location${plural(locationsattended)}</div>
              </div>
              <div style="${flexcolstyle} align-items: center;">
                  <div>Your top Parkrun was</div>
                  <div style="color: #EA0B86; font-size: ${topparkrun.length < 20 ? "223px" : "150px"}; font-weight: 900;">${topparkrun}</div>
                  <div>Where you attended <span style="color: #EA0B86;; font-weight: 900;">${topparkrunattendance}</span> Parkrun${plural(topparkrunattendance)}</div>
              </div>
          </div>`
          
    let badgeselement = badges == [] ? "" : `
  <div id="volunteer"
  style="font-weight: 900; ${divstyle} row-gap: 138px; background-color: #E4E643; font-size: 100px; ${flexcolstyle} color: #EA0B86 !important;">
  <div style="font-size: 115px">
      ${preferences.year == 0 ? "You've acomplished a lot" : "You acomplished a lot in " + preferences.year}
      </div>
  <div style="font-size: 73px">Lets look at some of your achievements</div>
  <div style="display: flex; gap: 50px; align-content: center; flex-wrap: wrap; justify-content: center;">
      ${badges.map(
          (item) => `<div id="badgeelem" badge="${item}" style="font-family: 'Montserrat', sans-serif; line-height: 1.5; text-align: center; box-sizing: border-box; width: 149px; height: 149px; contain: no-repeat; vertical-align: middle; display: inline-block; font-size: 0; overflow: hidden; margin: 0 5px; color: #ffa300;"></div>`,
        )
        .join("")} </div></div> `
console.log(badges)
    function htmlToImage(htmlString) {
      return new Promise((resolve, reject) => {
        if (!htmlString) return reject("HTML string is empty.")

        const wrapper = document.createElement("div")
        wrapper.innerHTML = htmlString
        const element = wrapper.firstElementChild
        const footer = document.createElement("div")

        footer.innerText = `${(preferences.watermark.name && userresults.name? userresults.name + " • " : "") + (preferences.watermark.ids && userresults.id ? userresults.id + " • " : "")}www.parkrunwrapped.com`
        footer.style = `color: #fff; font-family: Gabarito; font-size: 35px; width: 500%; opacity: .7; position: absolute; bottom: 10px;`
        element.appendChild(footer)
        if (!element) return reject("Failed to create DOM element.")

element.style.width = widthelement + "px";
element.style.height = `${heightelement}px`;
element.style.top = "-999999999px";

const badges = element.querySelectorAll("#badgeelem"); // querySelectorAll returns a NodeList

if (badges.length > 0) {
    // Use forEach on NodeList (make sure to loop properly)
    badges.forEach((badge) => {
        badge.style.backgroundImage = 'url("https://haveniscool.github.io/parkrunwrapped/images/badges/25r.svg")';
    });
}

        // Temporarily add the element to the DOM
        document.body.appendChild(element)
        // Load html2canvas and capture the full content
        const script = document.createElement("script")
        script.src =
          "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"
        script.onload = () => {
          html2canvas(element, {
            quality: 5,
            scrollX: 0,
            scrollY: -window.scrollY,
            useCORS: true,
            allowTaint: true,
            width: widthelement, // Explicitly set the width
            height: heightelement,
            cacheBust: false
          })
            .then((canvas) => {
              document.body.removeChild(element)
              resolve(canvas.toDataURL()) // Return the image as data URL
            })
            .catch(reject)
        }
        script.onerror = () => reject("Failed to load html2canvas.")
        document.head.appendChild(script)
      })
    }

    function createCarousel() {
      const carouselContainer = document.createElement("div")
      carouselContainer.style = `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, .7); display: flex; justify-content: center; align-items: center; z-index: 9999;`

      const carousel = document.createElement("div")
      carousel.style = `position: relative; background-color: #fff; border-radius: 3px; overflow: hidden;`

      const imagesWrapper = document.createElement("div")
      imagesWrapper.style = `display: flex; transition: transform .3s ease-in-out; width: 100%;`

      Promise.all(
        [minutes, fastest, agegrade, distance, badgeselement, parkruns].map(
          (content) =>
            htmlToImage(content)
              .then((imageData) => {
                const img = document.createElement("img")
                img.src = imageData
                img.style = `width: 100%; height: auto; object-fit: contain; object-position: center;`
                imagesWrapper.appendChild(img)
              })
              .catch(console.error),
        ),
      ).then(() => {
        carousel.appendChild(imagesWrapper)

        const createButton = (text, position, onClick) => {
          const button = document.createElement("button")
          button.textContent = text
          button.style = `position: absolute; top: 50%; background: rgba(0, 0, 0, .7); color: #fff; border: 0; font-size: 20px; padding: 10px; cursor: pointer; border-radius: 5px; transition: transform .2s ease;`
          button.style[position] = "10px"
          button.onmouseenter = () => (button.style.transform = "scale(1.2)")
          button.onmouseleave = () => (button.style.transform = "scale(1)")
          button.onclick = onClick
          return button
        }

        let currentIndex = 0
        const updateCarousel = () =>
          (imagesWrapper.style.transform = `translateX(${-currentIndex * 100}%)`)

        const prevButton = createButton("Prev", "left", () => {
          currentIndex = currentIndex > 0 ? currentIndex - 1 : 4
          updateCarousel()
        })
        const nextButton = createButton("Next", "right", () => {
          currentIndex = currentIndex < 4 ? currentIndex + 1 : 0
          updateCarousel()
        })

        const closeButton = document.createElement("button")
        closeButton.textContent = "Close"
        closeButton.style = `position: absolute; top: 10px; right: 10px; padding: 10px;
background: #E6224B; color: #fff; border: 0; font-size: 16px;
cursor: pointer; border-radius: 5px; transition: transform .2s ease;`
        closeButton.onclick = () => carouselContainer.remove()
        closeButton.onmouseenter = () =>
          (closeButton.style.transform = "scale(1.2)")
        closeButton.onmouseleave = () =>
          (closeButton.style.transform = "scale(1)")

        carouselContainer.appendChild(carousel)
        carouselContainer.appendChild(prevButton)
        carouselContainer.appendChild(nextButton)
        carouselContainer.appendChild(closeButton)

        const adjustCarouselSize = () => {
          const size = Math.min(window.innerWidth, window.innerHeight) * .7
          carousel.style.width = `${size}px`
          carousel.style.height = `auto`
        }

        adjustCarouselSize()
        window.addEventListener("resize", adjustCarouselSize)
        document.body.appendChild(carouselContainer)
      })
    }

    createCarousel()
  })
  .catch((error) => {
    console.error("Error:", error.message || error)
  })
