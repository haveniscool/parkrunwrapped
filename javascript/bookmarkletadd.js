window.addEventListener("load", () => {
  // Fetch the current version from the server
  fetch("https://haveniscool.github.io/parkrunwrapped/version.json")
    .then((res) => (res.ok ? res.json() : Promise.reject("Fetch failed")))
    .then(
      (data) => {
        // Compare the fetched version with the current one
        if (bookmarkletVersion !== data.currentversion) {
          const update = confirm(
            "Bookmarklet is out of date. Do you want to update it to the most current version?"
          );
          if (update) {
            open("https://haveniscool.github.io/parkrunwrapped/", "_blank");
          }
        }
      }
    )
    .catch((error) => {
      console.error("Error fetching version:", error);
      alert("Failed to check for bookmarklet update. Please try again later.");
    });

  // Dynamically add the script to the page
  let script = document.createElement("script");
  script.src =
    "https://haveniscool.github.io/parkrunwrapped/javascript/bookmarklet.js";

  // Handle script loading failure
  script.onerror = () => {
    const report = window.confirm("Error 001: Script failed. Report?");
    if (report) {
      window.open("https://form.jotform.com/parkrunwrapped/errorreport");
    }
  };

  // Append the script to the body
  document.body.appendChild(script);
});
