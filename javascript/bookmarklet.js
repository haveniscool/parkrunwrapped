function startWrapped() {
	          const style = document.createElement('style');
	// Create a link element for Google Fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Climate+Crisis&family=Gabarito:wght@400..900&family=Lexend:wght@100..900&display=swap';
    document.head.appendChild(fontLink);
style.innerHTML = `
  .circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: rotate 2s linear infinite;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 6px solid rgba(0, 0, 0, 0.3);
    border-top-color: #000;
  }

  @keyframes rotate {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
`;

document.head.appendChild(style);
const isrunning = document.body.querySelector("#isrunning")
let runcheck1 = true

if (
  isrunning &&
  window.confirm(
    "It looks like this bookmarklet is currently running, do you want to run it anyway?",
  )
) {
  runcheck1 = true
  document.body.removeChild(isrunning)
}

let runcheck2 = window.location.href.match(
  /https?:\/\/.*[Pp]arkrun\..*\/parkrunner\/\d+\/5k\/?/,
)
if (!runcheck2) {
  runcheck2 = window.location.href.match(
    /https?:\/\/.*[Pp]arkrun\..*\/parkrunner\/\d+\/all\/?/,
  )
  if (runcheck2) {
    runcheck2 = window.confirm(
      "It looks like you are on the wrong results page. This means that if you choose to continue, Junior Results could be included in your wrapped. To go to the correct page, replace '/all' in the URL with '/5k' Would you still like to continue?",
    )
  } else if (window.location.href.includes("parkrun.")) {
    runcheck2 = !window.confirm(
      "It looks like you are on the wrong parkrun page. You need to go to parkrun.org.uk/parkrunner/[Parkrun ID]/5k to continue. If this message is wrong, press cancel.",
    )
  } else {
    runcheck2 = window.confirm(
      "It looks like you are on the wrong page, would you still like to continue?",
    )
  }
}

if (runcheck1 && runcheck2) {
	const test = (t) => t ?? null
  const isrunningnow = Object.assign(document.createElement("div"), {
    id: "isrunning",
    style: "visibility: hidden",
  })
  document.body.appendChild(isrunningnow)

  function getData() {
    const parkrunIDs = {
      "parkrun ID": [
        "com.au",
        "co.at",
        "ca",
        "co.za",
        "com.de",
        "ie",
        "my",
        "co.nz",
        "sg",
        "se",
        "org.uk",
        "us",
      ],
      "Løber ID": ["dk"],
      "Athlete ID": ["fi"],
      "ID participant": ["fr"],
      "Codice identificativo atleta": ["it"],
      parkrunID: ["jp"],
      "Sportininko ID": ["lt"],
      "parkrun-nummer": ["co.nl"],
      "Utøver-ID": ["no"],
      "Numer uczestnika": ["pl"],
    }
    let [name, id] = ["", ""]

    let parkrunIDName = Object.keys(parkrunIDs).find((id) =>
      parkrunIDs[id].some(
        (domain) => window.location.host.includes(`parkrun.${domain}`),
      ),
    )

    if (!parkrunIDName) {
      parkrunIDName =
        Object.keys(parkrunIDs).find((key) =>
          document.querySelector(`span[title="${key}"]`),
        ) || parkrunIDName
    }

    // If there's a valid parkrunIDName (key), continue processing
   if (parkrunIDName) {
  const parkrunIDElement = document.querySelector(`span[title="${parkrunIDName}"]`)
  if (parkrunIDElement) {
    id = parkrunIDElement.textContent.replace(/[()]/g, "")
    let nameparent = parkrunIDElement.parentElement.cloneNode(true)
    nameparent.querySelector(`span[title="${parkrunIDName}"]`)?.remove()
    name = nameparent.textContent.trim().toUpperCase()
  }
}


let results = []
let resultstable = [...document.querySelectorAll("#results tbody tr")]
if (resultstable.length) {
      results = resultstable
        .map((r) => {
          const cells = r.querySelectorAll("td")
          if (cells.length < 7) return null
          const [d, m, y] = cells[1].innerText.split("/").map(Number)

          let splitnumber = cells[4].innerText.split(":").map(Number)
          let [h, mi, s] = (splitnumber.length == 2) ? [0, splitnumber[0], splitnumber[1]] : [splitnumber[2], splitnumber[1], splitnumber[0]]
          return {
            event: cells[0].innerText.trim(),
            date: new Date(y, m - 1, d),
            runnum: +cells[2].innerText,
            pos: +cells[3].innerText,
            time: { hours: h, minutes: mi, seconds: s },
            ageGrade: +cells[5].innerText.replace("%", ""),
            PB: cells[6].innerText === "PB",
          }
        })
        .filter(Boolean)
    }

    let badges = []
    let badgestable = [...document.querySelectorAll(".Vanity-page--clubIcon")]
    if (badgestable) {
      badges = badgestable
        .flatMap((b) => [...b.classList])
        .filter((cls) => cls.startsWith("milestone-v"))
        .map((cls) => cls.replace("milestone-v", ""))
        .map((badge) => badge + "v")
        .filter((b) =>
          ["10v", "25v", "50v", "100v", "250v", "500v", "1000v"].includes(
            String(b),
          ),
        )
    }

    return {
      id,
      name,
      results: results,
      badges: badges,
    }
  }

  function createPreferencesPopup(years) {
    return new Promise((resolve) => {
      const popup = document.createElement("div")
      popup.style = `font-family: 'gabarito', sans-serif; position: fixed; top: 50%; left: 50%; 
transform: translate(-50%, -50%); background: #fff; padding: 20px;
border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, .2); z-index: 9999;
width: 80%; max-width: 400px; max-height: 80vh; overflow-y: auto;`
      const form = document.createElement("form")
      form.style = "max-height: calc(80vh - 80px); overflow-y: auto;"
      const currentYear = new Date().getFullYear()
      let preferences = {
        year: "all",
        unit: 0,
        watermark: { name: true, ids: false },
        showbadges: false,
      }

      form.innerHTML = `
       <p style="font-size: 10px; margin-top: 5px; color: #E6224B"> If you are experiencing an Error, go to <a style="color: #E6224B; text-decoration: underline;" href="https://form.jotform.com/parkrunwrapped/errorreport">https://form.jotform.com/parkrunwrapped/errorreport</a></p>
       
        <form id="parkrunForm">
  <label for="yearSelect">Create Unofficial Parkrun Wrapped for:</label>
  <select id="yearSelect" style="border: 2px solid #E6224B; border-radius: 3px;">
    ${years
      .filter((y) => y >= 2004 && y <= currentYear)
      .map(
        (y) =>
          `<option value="${y}" ${preferences.year === y ? "selected" : ""}>${y}</option>`,
      )
      .join("")}
    <option value="all" ${preferences.year === "all" ? "selected" : ""}>All Time</option>
  </select>
  <div style="font-size: 10px; margin-top: 5px;">
    * Volunteer badges are excluded for non-All Time years.
  </div>
  <br>

  <label for="unitSelect">Unit:</label>
  <select id="unitSelect" style="border: 2px solid #E6224B; border-radius: 3px;">
    <option value="0" ${preferences.unit === 0 ? "selected" : ""}>kilometers</option>
    <option value="1" ${preferences.unit === 1 ? "selected" : ""}>miles</option>
  </select>
  <br><br>
    <label for="BADGES" style="font-size: 12px">
  Show 10v/10r Volunteering Badges? 
</label>
    <input type="checkbox" id="BADGES" checked>
<br>
  <fieldset>
    <legend>Watermark:</legend>
    <label style="font-size: 12px" for="NAMECHECK">
      Name: <input type="checkbox" id="NAMECHECKs" ${preferences.watermark.name ? "checked" : ""}>
    </label><br>

    <label style="font-size: 12px" for="IDCHECK">
      Id: <input type="checkbox" id="IDCHECK" ${preferences.watermark.ids ? "checked" : ""}>
    </label>
  </fieldset>

</form>`

      const submit = document.createElement("button")
      submit.textContent = "Create your wrapped"
      submit.type = "button"
      submit.style =
        "background-color: #E6224B; color: #fff; border: 1px solid rgb(43, 44, 46); border-radius: 3px"
      submit.onclick = () => {
        const yearSelect = form.querySelector("#yearSelect")
        const unitSelect = form.querySelector("#unitSelect")
        const showbadges = form.querySelector("#BADGES")
        const NAMECHECK = form.querySelector('#NAMECHECKs')
        const IDCHECK = form.querySelector("#IDCHECK")
        preferences = {
          year: yearSelect.value === "all" ? 0 : +yearSelect.value,
          unit: +unitSelect.value,
          watermark: {
            name: NAMECHECK.checked,
            ids: IDCHECK.checked,
          },
          showbadges: showbadges.checked,
        }
        resolve(preferences)
        popup.remove()
      }
 
      popup.append(form, submit)
      document.body.appendChild(popup)
    })
  }
  if (runcheck2) {
    const userresults = getData()
    if (userresults.results.length !== 0) {
      const yearsWithParkruns = [
        ...new Set(userresults.results.map((r) => r.date.getFullYear())),
      ]

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
    { "you could've binged every season of Friends": 5321 },
    { "you could've watched the marathon world record": 121.65 },
    { "you could've binged Game of Thrones": 3952.3 },
    { "you could've watched the full Star Wars saga": 1617 },
    { "you could've completed the entire Lord of the Rings trilogy": 683 },
    { "the ISS orbited the earth": 90 },
    { "the Apollo 11 could've flown to the moon and back": 11719 },
    { "you could've brushed your teeth": 2 },
    { "you played the shortest possible game of chess": 0.25 },
    { "you could've watched the longest game of professional American football": 4960 },
    { "you could've played a game of football": 90 },
    { "you could've watched Barbie (2024) and Oppenheimer": 294.15 },
    { "you could've watched The Muppet Movie": 97 }
  ];

  const validComparisons = times
    .map((item) => {
      const [text, value] = Object.entries(item)[0];
      return { text, value: Math.round(timeInMinutes / value) };
    })
    .filter(({ value }) => value > 0);  

  
  return "In that time " + validComparisons
    .map(({ text, value }) => `${text} ${value} times`)
    .at(Math.floor(Math.random() * validComparisons.length));
};



          const plural = (num, caps = false) =>
            num === 1 ? "" : caps ? "S" : "s"
          const calctotalminutes = (h = 0, m = 0, s = 0) => h * 60 + m + s / 60
          const getOneKey = (params, key) => params.map((e) => e[key])
          const sumofarray = (arr) => arr.reduce((a, v) => a + v, 0)
          const mode = (arr) =>
            arr.reduce((a, b) =>
              arr.filter((v) => v === a).length >=
              arr.filter((v) => v === b).length
                ? a
                : b,
            )
          const getDistanceComparison = (distance) => {
            let comparison = {
              height: {
                "the Eiffel Tower": 0.3300984,
                "the Statue of Liberty": 0.04605,
                "the Great Pyramid of Giza": 0.137,
                "the Empire State Building": 0.38,
                "the Burj Khalifa": 0.828,
                "Mount Everest": 8.849,
                "the One World Trade Center": 0.5413248,
                "Big Ben": 0.096,
                "Taipei 101": 0.509,
                "the CN Tower": 0.5533,
                "the Chichen Itza Pyramid": 0.03,
                "the Leaning Tower of Pisa (Without the Slant)": 0.05836,
                "the Acropolis": 0.156,
                "the Shard": 0.3096,
                "Tokyo Tower": 0.333,
                "Willis Tower": 0.442,
                "the Petronas Towers": 0.452,
                "Neuschwanstein Castle": 0.065,
                "Mont Blanc": 4.80559,
                "Mount Fuji": 3.776,
                "the Burj Al Arab": 0.321,
                "Sagrada Familia": 0.1725,
                "Mount Kilimanjaro": 5.895,
                "Vatican St. Peter’s Dome": 0.13657,
                "the Chrysler Building": 0.319,
                "St. Basil’s Cathedral": 0.0475,
                "the Tokyo Skytree": 0.634,
                "Mount St. Helens": 2.549,
                "Mount Elbrus": 5.641848,
                "the Sydney Tower Eye": 0.268,
                "the Palace of Westminster": 0.0985,
                "the Hyperion Tree": 0.11555,
              },
              length: {
                "the Golden Gate Bridge": 2.737,
                "the Sydney Harbour Bridge": 1.149096,
                "the Great Wall of China": 21196.67,
                "the Amazon River": 6400.361,
                "the Colorado River": 2333.549,
              },
              perimeter: {
                "the Colosseum": 0.545,
              },
              circumference: {
                "the Earth": 40074.275,
                Jupiter: 439264.007,
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

  const getAmountComparison = (a, b) => {
    if (a <= 0 || b <= 0) return 1;
    return a > b ? a / b : b / a;
  };

  const allEntries = Object.entries(comparison).flatMap(
    ([cat, items]) =>
      Object.entries(items).map(([name, value]) => ({
        category: cat,
        name,
        value,
      }))
  );

  const randomEntry =
    allEntries.length > 0
      ? allEntries[Math.floor(Math.random() * allEntries.length)]
      : { category: "unknown", name: "unknown", value: 1 };

  const comparisonResult = getAmountComparison(distance, randomEntry.value);

  return test(comparisonResult) ? `That's ${comparisonResult.toFixed(2)} times the ${randomEntry.category}${
    randomEntry.category === "distance" ? " from " : " of "
  }${randomEntry.name}` : "";
};

          const multiplier = (preferences.unit === 0 ? 5 : 3.10686) || 0

          const timesArray =
            test(yearresults.map((result) => result.time)) || []
          const hoursArray = test(timesArray.map(({ hours }) => hours)) || []
          const minutesArray =
            test(timesArray.map(({ minutes }) => minutes)) || []
          const secondsArray =
            test(timesArray.map(({ seconds }) => seconds)) || []

          const agegrades =
            test(yearresults.map((result) => result.ageGrade)) || []

const getBadge = (index, badge) => {
  const result = userresults.results[index];
  
  if (result && (preferences.year === 0 || result.date.getFullYear() === preferences.year)) {
    return badge;  
  }
  return null;  
};

const sortedResults = userresults.results.sort((a, b) => {
  return new Date(a.date) - new Date(b.date); 
});

let runningBadges = test(
  [9, 24, 49, 99, 249, 499, 999] 
    .map((index) => getBadge(index, `${index + 1}r`)) 
    .filter(Boolean), 
) || [];




          
          const parkrunsattended = test(yearresults.length) || 0
          const locationsattended =
            test(new Set(getOneKey(yearresults, "event")).size) || 0
          const topparkrun = test(mode(getOneKey(yearresults, "event"))) || ""
          const topparkrunattendance =
            test(
              yearresults.filter((eventObj) => eventObj.event === topparkrun)
                .length,
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
                    calctotalminutes(
                      hours,
                      minutesArray[index],
                      secondsArray[index],
                    ),
                  ),
                ),
              ),
            ) || 0
let comparison = " "
           comparison = test(getRandomTimeComparison(totalminutes)) || ""

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

          const fastestTotalMinutes =
            totalMinutesArray.length > 0
              ? Math.min(
                  ...totalMinutesArray.filter((val) => typeof val === "number"),
                )
              : 0

          const fastestEvent = yearresults.find(
            (eventObj) =>
              calctotalminutes(
                eventObj.time.hours,
                eventObj.time.minutes,
                eventObj.time.seconds,
              ) === fastestTotalMinutes,
          ) || { event: "unknown", date: new Date(0) }

          const {
            event: fastestparkrunlocation = "",
            date: fastestEventDate = 0,
          } = fastestEvent

          const fastestTime = [
            Math.floor(fastestTotalMinutes / 60), // Hours
            Math.floor(fastestTotalMinutes % 60), // Minutes
            Math.round((fastestTotalMinutes % 1) * 60), // Seconds
          ] || [0, 0, 0]

          const [fastesthour, fastestminute, fastestsecond] = fastestTime || [
            0, 0, 0,
          ]

          const fastestparkrundate =
            fastestEventDate instanceof Date && !isNaN(fastestEventDate)
              ? test(fastestEventDate.toLocaleDateString("en-US")) || ""
              : ""

          const totaldistance =
            test(Math.round(yearresults.length * multiplier)) || 0
            
          let distancecomparison = " "
          distancecomparison = getDistanceComparison(totaldistance)
        let badges = preferences.year === 0
  ? [
      ...runningBadges.map((badge) => badge),
      ...userresults.badges.map((badge) => badge),
    ]
  : runningBadges.map((badge) => badge);



const addLowerLevelBadges = (badges) => {
  const badgeSet = new Set(badges);
  const resultBadges = [...badges];

  badges.forEach((badge) => {
    if (badge.includes("v")) {
      const value = parseInt(badge, 10);

      const lowerBadges = ["500v", "250v", "100v", "50v", "25v", "10v"];
      lowerBadges.forEach((lowerBadge) => {
        const lowerValue = parseInt(lowerBadge, 10);

        if (value > lowerValue && !badgeSet.has(lowerBadge)) {
          resultBadges.push(lowerBadge);
        }
      });
    }
  });

  return resultBadges;
};

badges = addLowerLevelBadges(badges);
if (!preferences.showbadges) {
  badges = badges.filter((badge) => badge !== "10v" && badge !== "10r");
}



          if (false) {
console.log({multiplier, parkrunsattended, locationsattended, topparkrun, topparkrunattendance, fastestagegrade, avgagegrade, totalminutes, comparison, fastestEvent, fastestparkrunlocation, fastestTime, fastestparkrundate, totaldistance, badges, preferences})
console.log(preferences.watermark)
}
          let widthelement = 1079 * 1.5
          let heightelement = 1423.5 * 1.5
          const divstyle = `max-width: ${widthelement}px; position: absolute; min-width: ${widthelement}px; min-height: ${heightelement}px; max-height: ${heightelement}px; align-items: center; text-align: center; padding-left: 82px; padding-right: 82px; font-family: 'gabarito', sans-serif; color: #fff;`
          const flexcolstyle =
            "display: flex; flex-direction: column; justify-content: center;"
          const font36style = `text-align: left; font-size: 36px;`
          const bigletterstyle =
            `font-family: 'Climate Crisis' sans-serif; font-size: 202px; font-weight: 900;`
          const smallletterstyle = "font-size: 73px;"

          let minutes = `<div style="${divstyle} ${flexcolstyle}  row-gap: 208px; background-color: #FFA300; font-size: 73px;">
              <div style="${flexcolstyle} align-items: center; text-align: center; row-gap: 18px">
                  <div style="${smallletterstyle}">${preferences.year == 0 ? "YOU'VE" : "YOU"} SPENT A TOTAL OF</div>
                  <div style="${bigletterstyle}">${totalminutes}</div>
                  <div style="${smallletterstyle}">MINUTE${plural(totalminutes, true)} PARKRUNNING ${preferences.year == 0 ? "" : "IN " + preferences.year}</div>
              </div>
              <div style="font-size: 73px; letter-spacing: -1.25px">${comparison}</div>
          </div>`
          if (totalminutes == 0 || comparison == "") {
            minutes = ""
          }

          let fastest =
            [fastesthour, fastestminute, fastestsecond] == [] ||
            [fastesthour, fastestminute, fastestsecond] == [0, 0, 0]
              ? ""
              : `<div id="fastest" style="${divstyle} ${flexcolstyle} row-gap: 108px; background-color: #2B2C2E; font-size: 73px;">
              <div style="font-size: 73px;">${preferences.year == 0 ? "You've" : "In " + preferences.year + " you"} completed your fastest Parkrun in</div>
              
              <div style=" font-size: 202px; font-weight: 900; color: #FFA300">${fastesthour} hour${plural(fastesthour)}, ${fastestminute} minute${plural(fastestminute)}, and ${fastestsecond} second${plural(fastestsecond)}</div>
              <div style="font-size: 73px;">On ${fastestparkrundate} at ${fastestparkrunlocation}</div>
          </div>`

          let agegrade =
            fastestagegrade == 0 || avgagegrade == 0
              ? ""
              : `<div style="${divstyle} ${flexcolstyle} row-gap: 108px; background-color: #75A42E; font-size: 80px;">
                  <div style="${smallletterstyle}">Your fastest age grade ${preferences.year == 0 ? "is" : "in " + preferences.year + " was"}</div>
                  <div style="color: #E4E643; ${bigletterstyle}">${fastestagegrade}%</div>
                  
                  <div style="${smallletterstyle}">Your average age grade ${preferences.year == 0 ? "is" : "in " + preferences.year + " was"} <span style="font-weight: 900; color: #E4E643">${avgagegrade}%</span></div>
                  
          </div>`

          let distance =
            distancecomparison == "" || totaldistance == 0
              ? ""
              : `<div style="${divstyle} ${flexcolstyle} row-gap: 138px; background-color: #E6224B;">
                  <div style="${smallletterstyle}">${preferences.year == 0 ? "You've been on a journey" : `${preferences.year} took you on a journey.`}</div>
                  <div style=" font-size: 160px; font-weight: 900;">${preferences.year == 0 ? "You've " : "You"} traveled a total of  <span style="style="color: #E4E643">${totaldistance} ${preferences.unit == 0 ? "kilometers" : "miles"}</span></div>
                  <div style="${smallletterstyle}>That's <span style="font-weight: 900; color: #E4E643">${distancecomparison}</span></div>
          </div>`

          let parkruns =
            locationsattended == 0 ||
            parkrunsattended == 0 ||
            topparkrun == "" ||
            topparkrunattendance == ""
              ? ""
              : `<div id="parkruns" style="${divstyle} ${flexcolstyle} row-gap: 138px; background-color: #2B2C2E; font-size: 103px;">
              <div style="${flexcolstyle} align-items: center;">
                  <div>${preferences.year == 0 ? "Y" : "In " + preferences.year + " y"}ou attended <span style="color: #EA0B86; font-weight: 900;">${parkrunsattended}</span></div>
                  <div>Parkrun${plural(parkrunsattended)} At</div>
                  <div><span style="color: #EA0B86; font-weight: 900;">${locationsattended}</span> location${plural(locationsattended)}</div>
              </div>
              <div style="${flexcolstyle} align-items: center;">
                  <div>Your top Parkrun was</div>
                  <div style="color: #EA0B86; font-size: ${topparkrun.length < 20 ? "223px" : "150px"}; font-weight: 900;">${topparkrun}</div>
                  <div>Where you attended <span style="color: #EA0B86; font-weight: 900;">${topparkrunattendance}</span> Parkrun${plural(topparkrunattendance)}</div>
              </div>
          </div>`

          let badgeselement =
            badges.length == 0
              ? ""
              : `
  <div id="volunteer"
  style="font-weight: 900; ${divstyle} row-gap: 138px; background-color: #E4E643; font-size: 100px; ${flexcolstyle} color: #EA0B86 !important;">
  <div style="font-size: 115px">
      ${preferences.year == 0 ? "You've accomplished a lot" : "You accomplished a lot in " + preferences.year}
      </div>
  <div style="font-size: 73px">Let's look at some of your achievements</div>
  <div style="display: flex; gap: 50px; align-content: center; flex-wrap: wrap; justify-content: center;">
      ${badges
        .map(
          (item) =>
            `<div id="badgeelem" badge="${item}" style="font-family: 'Montserrat', sans-serif; line-height: 1.5; text-align: center; box-sizing: border-box; vertical-align: middle; display: inline-block; font-size: 0; margin: 0;"></div>`,
        )
        .join("")} </div></div> `

          function htmlToImage(htmlString) {
   const measureTextWidth = (text, font = "16px Arial") =>
  document.createElement("canvas").getContext("2d").measureText(text).width;

            return new Promise((resolve, reject) => {
              if (!htmlString) return reject("HTML string is empty.")

              const wrapper = document.createElement("div")
              wrapper.innerHTML = htmlString
              const element = wrapper.firstElementChild
element.style.position = 'relative'; 

              const footer = document.createElement("div")
   let footertext = `${preferences.watermark.name && userresults.name ? userresults.name : ""} ${preferences.watermark.ids && userresults.id ? userresults.id: ""}`;
if (measureTextWidth(footertext, `35px 'gabarito', sans-serif;`) > widthelement) footertext = "";


              footer.style = `color: #fff; font-family: 'gabarito', sans-serif; font-size: 35px; width: 500%; opacity: .7; position: absolute; bottom: 10px; text-align: center`
              element.appendChild(footer)
              footer.innerText = footertext
              const header = document.createElement("div")
              header.innerText =
                "Unofficial Parkrun Wrapped  • www.parkrunwrapped.com"
              header.style = `color: #fff; font-family: 'Climate Crisis' sans-serif; font-size: 25px; opacity: .3; position: absolute; top: 10px; text-align: center; width: 300%`
              element.appendChild(header)
              if (!element) return reject("Failed to create DOM element.")

              element.style.width = `${heightelement}px`
              element.style.height = `${heightelement}px`
              element.style.top = "-999999999px"

 const badges = element.querySelectorAll("#badgeelem");
badges.forEach(badge => {
  const imageUrl = `https://parkrunwrapped.havenline.art/images/badges/${badge.getAttribute("badge")}.svg`;
  Object.assign(badge.style, {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: "190px 190px",
    backgroundClip: "border-box",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "50% 50%",
    width: "190px",
    height: "190px",
    overflow: "visible",
  });
});
              document.body.appendChild(element)

              const script = document.createElement("script")
              script.src =
                "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"

              script.onload = () => {
                html2canvas(element, {
                  scrollX: 0,
                  scrollY: -window.scrollY,
                  useCORS: true,
                  allowTaint: true,
                  width: widthelement,
                  height: heightelement,
                  cacheBust: false,
                  quality: 10,
                })
                  .then((canvas) => {
                    document.body.removeChild(element)
                    resolve(canvas.toDataURL())

                  })
                  .catch((error) => {
                    console.error("Error during html2canvas rendering:", error)
                    reject(error)
                  })
              }

              script.onerror = () => reject("Failed to load html2canvas.")
              document.head.appendChild(script)
            })
          }


function createCarousel() {
  const carouselContainer = document.createElement("div")
  carouselContainer.style =
    "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, .7); display: flex; justify-content: center; align-items: center; z-index: 9999;"

  const carousel = document.createElement("div")
  carousel.style = "position: relative; background-color: #fff; border-radius: 3px; overflow: hidden;"

  const imagesWrapper = document.createElement("div")
  imagesWrapper.style = "display: flex; transition: transform .3s ease-in-out; width: fit-content;"


  const circle = document.createElement("div");
  circle.classList.add("circle");
  carousel.appendChild(circle);

 
  
  let vars = [minutes, fastest, agegrade, distance, badgeselement, parkruns].filter(inner => inner!=="");

  let imagesLoaded = 0

  Promise.all(
    vars.map((content) =>
      htmlToImage(content)
        .then((imageData) => {
          const img = document.createElement("img")
          img.src = imageData
          img.style = "width: 100%; height: auto; object-fit: contain; object-position: center;"
          imagesWrapper.appendChild(img)

          img.onload = () => {
            imagesLoaded++
            if (imagesLoaded === vars.length) {
              
              carousel.appendChild(imagesWrapper)
                            circle.remove();

            }
          }
        })
        .catch(console.error)
    )
  )
const stylebutton = "position: absolute; padding: 10px; color: #fff; border: 0; font-size: 16px; cursor: pointer; border-radius: 5px; transition: transform .2s ease;"

  const createButton = (text, position, onClick) => {
    const button = document.createElement("button")
    button.textContent = text
    button.style = stylebutton + "top: 50%; background: rgba(0, 0, 0, .7)"
    button.style[position] = "10px"
    button.onmouseenter = () =>
      (button.style.transform = "scale(1.2)")
    button.onmouseleave = () =>
      (button.style.transform = "scale(1)")
    button.onclick = onClick
    return button
  }

  let currentIndex = 0
  const updateCarousel = () =>
    (imagesWrapper.style.transform = `translateX(${-currentIndex * 100}%)`)

  const prevButton = createButton("Prev", "left", () => {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : (vars.length - 1)
    updateCarousel()
  })
  const nextButton = createButton("Next", "right", () => {
    currentIndex = currentIndex < (vars.length - 1) ? currentIndex + 1 : 0
    updateCarousel()
  })

  const closeButton = document.createElement("button")
  closeButton.textContent = "Close"
  closeButton.style = stylebutton + "top: 10px; right: 10px; background: #E6224B;"
  closeButton.onclick = () => {
    carouselContainer.remove()
    const isRunningElement =
      document.body.querySelector("#isrunning")
    if (isRunningElement) {
      document.body.removeChild(isRunningElement)
    }
  }

  closeButton.onmouseenter = () =>
    (closeButton.style.transform = "scale(1.2)")
  closeButton.onmouseleave = () =>
    (closeButton.style.transform = "scale(1)")

  const downloadButton = document.createElement("button")
  downloadButton.textContent = "Download"
  downloadButton.style = stylebutton + " top: 10px; left: 10px; background: rgba(0, 0, 0, .7);"
  downloadButton.onclick = () => {
    const dataUri = imagesWrapper.children[currentIndex].src
    const link = document.createElement("a")
    link.href = dataUri
    link.download = "parkrunwrappedimage" + ".png"
    link.click()
  }
  downloadButton.onmouseenter = () =>
    (downloadButton.style.transform = "scale(1.2)")
  downloadButton.onmouseleave = () =>
    (downloadButton.style.transform = "scale(1)")

  carouselContainer.appendChild(carousel)
  carouselContainer.appendChild(prevButton)
  carouselContainer.appendChild(nextButton)
  carouselContainer.appendChild(closeButton)
  carouselContainer.appendChild(downloadButton)

  const adjustCarouselSize = () => {
    const aspectRatio = (1079 * 1.5) / (1423.5 * 1.5)
			const size = window.innerWidth < window.innerHeight ? Math.min(window.innerWidth * 0.8, (1079 * 1.5)) : Math.min(window.innerHeight * 0.8, (1423.5 * 1.5))
      
    if (window.innerWidth < window.innerHeight) {
      carousel.style.width = `${size}px`
      carousel.style.height = `${size / aspectRatio}px`
    } else {
      carousel.style.height = `${size}px`
      carousel.style.width = `${size * aspectRatio}px`
    }

    carousel.style.transition = "all 0.3s ease-in-out"
  }

  window.addEventListener("resize", adjustCarouselSize)
  adjustCarouselSize()

  document.body.appendChild(carouselContainer)
}
          createCarousel()
        })
        .catch((error) => {
          console.error("Error:", error.message || error)
        })
    } else {
      window.alert("No results found!")
    }
  }
}
}
startWrapped();
